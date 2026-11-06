// Shared audit question definitions for the compliance audit pages.
// The live versions are stored in Firestore (collection FORMS_COLLECTION, one
// document per audit type) and edited on question-review.html. The defaults
// below are the starting questions, used until a type is saved on the Questions page.

export const FORMS_COLLECTION = 'Compliance Audit Forms';
export const AUDIT_TYPES = ['Desktop', 'Post Completion', 'WIP'];
export const OUTCOMES = {
  'Desktop': ['Pass', 'Category 1 fail', 'Category 2 fail', 'Category 3 fail'],
  'Post Completion': ['Pass', 'Category 1 fail', 'Category 2 fail', 'Category 3 fail'],
  'WIP': ['Pass', 'Referral']
};

/* ---------------------------------------------------------------------------
   Definition format (plain JSON, so it can be stored and edited)
   form     = { sections: [section] }
   section  = { id, title, showIf?: cond, items: [item] }
   cond     = { key, op: 'in' | 'notIn', values: [string] }
   items:
     choice     { type, key, label, required, options:[{label, fail}], followUps:[followUp] }
     followUp   { type:'photo'|'text', key, label, when:[optionLabel], required? }
     text       { type:'text'|'textarea', key, label, required }
     photo      { type:'photo', key, label, required }
     checkgroup { type, key, label, groups:[{ key, label, showIf?, options:[string] }] }
     signature  { type, key, label, required }
--------------------------------------------------------------------------- */

const opt = (label, fail = false) => ({ label, fail });
const YN = () => [opt('Yes'), opt('No')];

// Post completion style: Yes / No - upload photograph, photo when No
function pcq(key, label, noLabel = 'No - upload photograph') {
  return { type: 'choice', key, label, required: true, options: [opt('Yes'), opt(noLabel, true)],
    followUps: [{ type: 'photo', key: key + '_photo', label: 'Photograph of non-conformance', when: [noLabel] }] };
}
// WIP style: Yes / No with an evidence photo for either answer
function wq(key, label, photoLabel = 'Provide photographic evidence') {
  return { type: 'choice', key, label, required: true, options: [opt('Yes'), opt('No', true)],
    followUps: [{ type: 'photo', key: key + '_photo', label: photoLabel, when: ['Yes', 'No'] }] };
}
const gate = (key, label) => ({ type: 'choice', key, label, required: true, options: YN(), followUps: [] });
const yesOnly = key => ({ key, op: 'in', values: ['Yes'] });

function postCompletionDefault() {
  return { sections: [
    { id: 'electric', title: 'Electric', items: [gate('electricMeterInstalled', 'Was an electric meter installed?')] },
    { id: 'electricChecks', title: 'Electric Checks', showIf: yesOnly('electricMeterInstalled'), items: [
      { type: 'choice', key: 'abCodeOrOutOfScope', label: 'Is there evidence that the installer has incorrectly worked on an A or B code or out of scope (e.g. multi-phase)?', required: true,
        options: [opt('Yes - upload photograph', true), opt('No')],
        followUps: [{ type: 'photo', key: 'abCodeOrOutOfScope_photo', label: 'Photograph of non-conformance', when: ['Yes - upload photograph'] }] },
      pcq('cablesTerminationsSafe', 'Were all cables and terminations left in a safe condition?'),
      pcq('polarityConfirmed', 'Has polarity been confirmed?'),
      pcq('equipmentSealed', 'Has all equipment been sealed with refs visible?'),
      pcq('polarityMarkers', 'Have polarity markers been applied correctly (in accordance with contract requirements)?'),
      pcq('terminalsChecked', 'Is there evidence that all terminals have been checked for tightness and 2 points of contact?'),
      pcq('cablesSecured', 'Have all cables been secured correctly where possible?'),
      pcq('elecDocsLabelsLeft', 'Has all documentation and labels been left on site?'),
      { type: 'choice', key: 'elecPhotosRecorded', label: 'Have all photographs been recorded as per client requirement?', required: true,
        options: [opt('Yes'), opt('No - what was missing/incorrect', true)],
        followUps: [{ type: 'text', key: 'elecPhotosMissing', label: 'List all photographs that are missing or incorrect', when: ['No - what was missing/incorrect'] }] }
    ]},
    { id: 'gas', title: 'Gas', items: [gate('gasMeterInstalled', 'Has a gas meter been installed?')] },
    { id: 'gasChecks', title: 'Gas Checks', showIf: yesOnly('gasMeterInstalled'), items: [
      pcq('pipeworkSecured', 'Is all pipework secured with no signs of distress?', 'No - upload photographs'),
      pcq('letBy', 'Is there evidence that let-by has been completed correctly?'),
      pcq('tightnessTest', 'Is there evidence that tightness testing has been completed and recorded correctly?'),
      pcq('workingPressureTest', 'Is there evidence that working pressure testing has been completed and recorded correctly?'),
      pcq('ldfChecks', 'Is there evidence that the LDF checks have been completed and recorded correctly?'),
      pcq('gasMeterSecure', 'Is the gas meter secure, with bracket correctly fitted?'),
      pcq('earthBondingIssues', 'Have any earth bonding issues been correctly identified and actioned?'),
      pcq('continuityBonds', 'Is there evidence that continuity bonds were used correctly?', 'No - upload evidence'),
      pcq('ventilationFluing', 'Have all ventilation and fluing issues been correctly identified and recorded?'),
      pcq('appliancesInspected', 'Is there evidence that all appliances have been identified, visually inspected and recorded?'),
      pcq('gasLabelsDocsLeft', 'Have all labels and documentation been left on site as required?'),
      { type: 'choice', key: 'gasPhotosRecorded', label: 'Have all photographs been recorded as per client requirements?', required: true,
        options: [opt('Yes'), opt('No - what was missing or incorrect?', true)],
        followUps: [{ type: 'text', key: 'gasPhotosMissing', label: 'List of all photographs missing or incorrect', when: ['No - what was missing or incorrect?'] }] }
    ]},
    { id: 'nonConformance', title: 'Detail of Non-Conformance', showIf: { key: 'auditOutcome', op: 'notIn', values: ['Pass'] }, items: [
      { type: 'checkgroup', key: 'cat1', label: 'Category 1 fails', groups: [
        { key: 'cat1Gas', label: 'Gas', showIf: yesOnly('gasMeterInstalled'), options: ['Uncontrolled escape', 'Unreported/inspected appliances', 'Failure to correctly carry out gas testing', 'Failure to correctly carry out LDF checks', 'Failure to identify and record an ID', 'Incorrect or unsafe equipment installed'] },
        { key: 'cat1Electric', label: 'Electric', showIf: yesOnly('electricMeterInstalled'), options: ['Exposed copper', 'Open unbunged port', 'Reverse polarity', 'Reverse energy', 'Unreported A Code'] }
      ]},
      { type: 'checkgroup', key: 'cat2', label: 'Category 2 fails', groups: [
        { key: 'cat2Gas', label: 'Gas', showIf: yesOnly('gasMeterInstalled'), options: ['Exposed PE pipe', 'Spigot not sealed', 'EVC falls to on', 'Regulator not exchanged', 'Gas pipework not supported correctly', 'Missing cabinet door left', 'Bracket bent or shear bolt not replaced/fitted', 'Insufficient distance between meter and elec service/cables', 'Earth bonding not adequate and unreported/identified', 'Inaccurately recorded gas test results', 'Unreported AR', 'On/Off tape not correctly applied'] },
        { key: 'cat2Electric', label: 'Electric', showIf: yesOnly('electricMeterInstalled'), options: ['Unreported B Code', 'Damaged terminals e.g. overtightening', 'Meter not secured to backboard', 'Incorrect fuse rating for cabling', 'Inner insulation exposed or visible', 'Seals not fitted and legible', 'Non-conforming isolators and blocks left in situ', 'Security blocks not removed', 'Tails not correctly marked for polarity'] }
      ]},
      { type: 'checkgroup', key: 'cat3', label: 'Category 3', groups: [
        { key: 'cat3Gas', label: 'Gas', showIf: yesOnly('gasMeterInstalled'), options: ['Missing/unclear mandatory photograph', 'Missing sticker or label', 'Waste left on site', 'Unions not marked', 'No evidence union gauge used'] },
        { key: 'cat3Electric', label: 'Electric', showIf: yesOnly('electricMeterInstalled'), options: ['Unreported C Code/most severe missed', 'Missing/unclear photograph', 'One seal illegible', 'Old polarity markers/collars left in situ', 'Unharmonised tails incorrectly flagged', 'Paint on tails', 'Waste left on site'] }
      ]}
    ]},
    { id: 'feedback', title: 'Feedback / Coaching', items: [
      { type: 'textarea', key: 'positivesFeedback', label: 'Positives from installation to feedback to installer', required: false },
      { type: 'textarea', key: 'nonConformanceFeedback', label: 'Details of non-conformances to feedback to engineer', required: false }
    ]}
  ]};
}

function wipDefault() {
  return { sections: [
    { id: 'safety', title: 'Safety', items: [
      { type: 'choice', key: 'riskAssessment', label: 'Was a risk assessment completed?', required: true,
        options: [opt('Yes - no hazards identified'), opt('Yes - hazards identified'), opt('No', true)],
        followUps: [{ type: 'text', key: 'hazardsIdentified', label: 'What hazards were identified?', when: ['Yes - hazards identified'] }] },
      { type: 'choice', key: 'powerToolsCondition', label: 'Are all portable power tools in good/working condition?', required: true,
        options: [opt('Yes'), opt('No', true)],
        followUps: [{ type: 'photo', key: 'powerToolsCondition_photo', label: 'Provide evidence of the issues identified. Ensure that the equipment is removed from service.', when: ['No'] }] }
    ]},
    { id: 'electric', title: 'Electric', items: [gate('electricMeterInstalled', 'Has an electric meter been installed?')] },
    { id: 'electricChecks', title: 'Electric Checks', showIf: yesOnly('electricMeterInstalled'), items: [
      wq('elecPPEUsed', 'Was Personal Protective Equipment used as required?', 'Upload photograph of PPE in use'),
      { type: 'choice', key: 'elecPPEInDate', label: 'Was PPE in date and in good working order?', required: true, options: [opt('Yes'), opt('No', true)],
        followUps: [{ type: 'text', key: 'elecPPEIssues', label: 'Please provide details of issues identified', when: ['No'] }] },
      wq('elecTesting', 'Was all electrical testing completed correctly?', 'Provide photograph of testing'),
      wq('meterPolarityMarked', 'Was the installed meter correctly marked showing polarity?', 'Upload photograph of meter with polarity markings'),
      wq('existingEquipment', 'Was existing electrical equipment replaced or checked?', 'Provide photograph'),
      wq('cablingWorkmanship', 'Was cabling upgraded/replaced, with good workmanship demonstrated?'),
      wq('elecSealed', 'Was all equipment sealed as required?'),
      wq('elecLabelsDocs', 'Were labels, stickers and any documentation completed as required?'),
      wq('socketTest', 'Was correct polarity confirmed with a socket test?')
    ]},
    { id: 'gas', title: 'Gas', items: [gate('gasMeterInstalled', 'Was a gas meter installed?')] },
    { id: 'gasChecks', title: 'Gas Checks', showIf: yesOnly('gasMeterInstalled'), items: [
      wq('gasPPEUsed', 'Was all Personal Protective Equipment used as required?', 'Upload photograph of PPE in use'),
      { type: 'choice', key: 'gasPPEInDate', label: 'Was PPE in date and in good working order?', required: true, options: [opt('Yes'), opt('No', true)],
        followUps: [{ type: 'text', key: 'gasPPEIssues', label: 'Please provide details of issues identified', when: ['No'] }] },
      wq('strayVoltage', 'Did the installer check for stray voltage?', 'Please provide photographic evidence'),
      wq('gasTestingRemoved', 'Was all gas testing completed correctly? (Removed)', 'Please provide photographic evidence'),
      wq('tempContinuityBonds', 'Were temporary continuity bonds used correctly?', 'Please provide photographic evidence'),
      wq('removedMeterCapped', 'Was the removed meter capped and stored correctly?', 'Please provide photographic evidence'),
      wq('washersRegulator', 'Were washers replaced and a new regulator installed?'),
      { type: 'choice', key: 'hotWorks', label: 'Was any pipework (hot works) required?', required: true,
        options: [opt('Yes - completed correctly'), opt('Yes - completed with support'), opt('No - not required'), opt('No - identified training issue/lack of confidence', true)],
        followUps: [{ type: 'photo', key: 'hotWorks_photo', label: 'Provide photographic evidence of completed work', when: ['Yes - completed correctly', 'Yes - completed with support'] }] },
      wq('purgeRelight', 'Was the purge and relight process completed correctly?'),
      wq('gasTestsInstalled', 'Were all gas tests completed correctly? (Installed)', 'Please provide photographic evidence'),
      wq('earthBondingCheck', 'Did the installer check earth bonding arrangement and report exceptions?', 'Upload photographic evidence'),
      wq('idArIncidents', 'If required, were any ID or AR incidents identified and actioned correctly?', 'Please provide photographic evidence'),
      wq('labelsStickersLeft', 'Were all labels and stickers left as per agreed process?', 'Please provide photographic evidence')
    ]},
    { id: 'jobSummary', title: 'Job Summary', items: [
      ['smartCommissioning', 'Did the installer correctly carry out the smart commissioning process?'],
      ['energyEfficiencyAdvice', 'Did the installer provide the customer with effective tailored energy efficiency advice?'],
      ['allPhotosUploaded', 'Did the installer take and upload all photographs as required?'],
      ['workedSafely', 'Did the installer work safely throughout?'],
      ['wasteRemoved', 'Was all waste removed from site?'],
      ['final2MinuteCheck', 'Did the installer carry out a final 2 minute check?']
    ].map(([key, label]) => ({ type: 'choice', key, label, required: true, options: [opt('Yes'), opt('No', true)], followUps: [] })) },
    { id: 'submission', title: 'Submission', items: [
      { type: 'textarea', key: 'positivesFeedback', label: 'What positive and constructive feedback was provided to the installer?', required: false },
      { type: 'textarea', key: 'coachingAgreed', label: 'What coaching or support was provided or agreed?', required: false },
      { type: 'signature', key: 'assessorSignature', label: 'Assessor signature', required: true },
      { type: 'signature', key: 'installerSignature', label: 'Installer/Engineer signature', required: true }
    ]}
  ]};
}

export function defaultForm(type) {
  return type === 'WIP' ? wipDefault() : postCompletionDefault();
}

/* ------------------------------------------------------------------ helpers */
export function condMet(cond, values) {
  if (!cond || !cond.key) return true;
  const v = values[cond.key];
  const vals = cond.values || [];
  if (cond.op === 'notIn') return !!v && !vals.includes(v);
  return vals.includes(v);
}
export const optionLabels = item => (item.options || []).map(o => o.label);
export const isFailAnswer = (item, answer) => !!(item.options || []).find(o => o.label === answer && o.fail);
export const isScored = item => item.type === 'choice' && (item.options || []).some(o => o.fail);

// Questions whose answers can be used to show/hide other parts of the form
export function conditionSources(form, type, beforeSectionIndex = Infinity) {
  const list = [{ key: 'auditOutcome', label: 'Audit outcome', options: OUTCOMES[type] || [] }];
  (form.sections || []).forEach((s, i) => {
    if (i >= beforeSectionIndex) return;
    s.items.forEach(it => { if (it.type === 'choice') list.push({ key: it.key, label: it.label, options: optionLabels(it) }); });
  });
  return list;
}

export function newKey(prefix = 'q') {
  return prefix + '_' + Math.random().toString(36).slice(2, 8);
}

// Basic sanity checks before saving / using a definition
export function validateForm(form) {
  const errors = [];
  const keys = new Set();
  const addKey = (k, where) => { if (!k) errors.push(`Missing key in ${where}`); else if (keys.has(k)) errors.push(`Duplicate key "${k}" (${where})`); else keys.add(k); };
  if (!form || !Array.isArray(form.sections)) return ['Form has no sections'];
  form.sections.forEach((s, si) => {
    const where = `section ${si + 1}${s.title ? ' "' + s.title + '"' : ''}`;
    if (!s.title?.trim()) errors.push(`Section ${si + 1} needs a title`);
    (s.items || []).forEach((it, ii) => {
      const w = `${where}, item ${ii + 1}`;
      addKey(it.key, w);
      if (!it.label?.trim()) errors.push(`${w} needs a question/label`);
      if (it.type === 'choice') {
        const labels = optionLabels(it).map(l => l.trim());
        if (labels.length < 2) errors.push(`${w} needs at least two answers`);
        if (labels.some(l => !l)) errors.push(`${w} has a blank answer`);
        if (new Set(labels).size !== labels.length) errors.push(`${w} has duplicate answers`);
        (it.followUps || []).forEach((f, fi) => {
          addKey(f.key, `${w}, follow-up ${fi + 1}`);
          if (!f.label?.trim()) errors.push(`${w}: follow-up ${fi + 1} needs a label`);
          if (!(f.when || []).length) errors.push(`${w}: follow-up "${f.label || fi + 1}" isn't linked to any answer`);
        });
      }
      if (it.type === 'checkgroup') (it.groups || []).forEach((g, gi) => {
        addKey(g.key, `${w}, group ${gi + 1}`);
        if (!g.label?.trim()) errors.push(`${w}: group ${gi + 1} needs a name`);
        if (!(g.options || []).filter(o => o.trim()).length) errors.push(`${w}: group "${g.label || gi + 1}" has no items`);
      });
    });
  });
  return errors;
}
