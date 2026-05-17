// vet-data.jsx — mock data for the veterinary clinic app.
// Sarah Chen + Poppy is the cross-end demo: she adopted Poppy from Willow Creek
// (shelter side) and booked her first vet visit at Forest Park Vet (this app).

const CLINIC = {
  name: 'Forest Park Veterinary',
  district: '4380 SW Macadam Ave · Portland, OR',
  lead: 'Dr. Anjali Patel',
  team: [
    { name: 'Dr. Anjali Patel', role: 'Lead Vet · DVM' },
    { name: 'Dr. Jamie Nguyen', role: 'Associate Vet · DVM' },
    { name: 'Riley Brooks',     role: 'Vet Tech · CVT'   },
  ],
  hours: 'Mon–Sat 8a–7p',
  rating: 4.9,
  reviews: 214,
  inNetwork: ['Lemonade Pet', 'Trupanion', 'Healthy Paws'],
  license: 'OR-VET-2018-44119',
};

const VET_STATS = {
  todayAppointments: 8,
  delta: '+2 vs yesterday',
  draftNotes: 3,
  pendingClaims: 4,
  activePatients: 312,
};

// All appointments visible across Day/Week/Month views.
const APPOINTMENTS = [
  {
    id: 'apt-001', when: '2026-04-16T09:30', day: 'Wed Apr 16', time: '9:30a', duration: 30,
    patient: 'Poppy', owner: 'Sarah Chen', kind: 'dog', breed: 'Golden Retriever Mix',
    age: '2 yr', sex: 'F', weight: 24.3,
    visitType: 'Wellness · New patient', clinician: 'Dr. Patel',
    insurance: { provider: 'Lemonade Pet', plan: 'Plus', copay: 25, inNetwork: true, status: 'Active' },
    status: 'NEW', room: 'Exam 2',
    chiefComplaint: 'New-patient wellness exam · routine vaccines',
    history: 'Adopted from Willow Creek Rescue 2 weeks ago. House-trained, energetic. No prior medical records on file.',
  },
  {
    id: 'apt-002', when: '2026-04-16T10:30', day: 'Wed Apr 16', time: '10:30a', duration: 20,
    patient: 'Mochi', owner: 'David Liu', kind: 'cat', breed: 'British Shorthair',
    age: '4 yr', sex: 'M', weight: 5.2,
    visitType: 'Vaccines · Annual booster', clinician: 'Dr. Patel',
    insurance: { provider: 'Trupanion', plan: 'Premium', copay: 30, inNetwork: true, status: 'Active' },
    status: 'RTN', room: 'Exam 1',
  },
  {
    id: 'apt-003', when: '2026-04-16T11:00', day: 'Wed Apr 16', time: '11:00a', duration: 45,
    patient: 'Bruno', owner: 'Priya Raman', kind: 'dog', breed: 'French Bulldog',
    age: '6 yr', sex: 'M', weight: 11.4,
    visitType: 'Dental cleaning', clinician: 'Dr. Nguyen',
    insurance: { provider: 'Healthy Paws', plan: 'Std', copay: 50, inNetwork: true, status: 'Active' },
    status: 'RTN', room: 'OR-1',
  },
  {
    id: 'apt-004', when: '2026-04-16T14:00', day: 'Wed Apr 16', time: '2:00p', duration: 30,
    patient: 'Whiskey', owner: 'Maya Chen', kind: 'cat', breed: 'Maine Coon',
    age: '9 yr', sex: 'F', weight: 6.8,
    visitType: 'Senior wellness', clinician: 'Dr. Patel',
    insurance: { provider: 'Self-pay', plan: '—', copay: 0, inNetwork: false, status: '—' },
    status: 'RTN', room: 'Exam 2',
  },
  {
    id: 'apt-005', when: '2026-04-16T15:30', day: 'Wed Apr 16', time: '3:30p', duration: 30,
    patient: 'Nori', owner: 'Aiden Park', kind: 'dog', breed: 'Shiba Inu',
    age: '3 yr', sex: 'M', weight: 9.6,
    visitType: 'Limping · L hind leg', clinician: 'Dr. Patel',
    insurance: { provider: 'Lemonade Pet', plan: 'Base', copay: 25, inNetwork: true, status: 'Active' },
    status: 'NEW', room: 'Exam 1',
  },
];

// Week view: Apr 13–19
const WEEK_VIEW = [
  { date: 'Apr 13', dow: 'Mon', count: 9  },
  { date: 'Apr 14', dow: 'Tue', count: 7  },
  { date: 'Apr 15', dow: 'Wed', count: 11 },
  { date: 'Apr 16', dow: 'Thu', count: 8, today: true },
  { date: 'Apr 17', dow: 'Fri', count: 10 },
  { date: 'Apr 18', dow: 'Sat', count: 6  },
  { date: 'Apr 19', dow: 'Sun', count: 0, closed: true },
];

// April 2026 — calendar grid: density 0..3 per cell (where applicable)
const MONTH_VIEW_DATES = (() => {
  const out = [];
  // April 2026: starts on Wed (Apr 1 = Wed). 30 days.
  const startBlanks = 3; // Sun..Tue blanks before Apr 1
  for (let i = 0; i < startBlanks; i++) out.push({ blank: true });
  for (let d = 1; d <= 30; d++) {
    const dow = (startBlanks + d - 1) % 7;        // 0=Sun..6=Sat
    const closed = dow === 0;                      // Sundays closed
    const density = closed ? 0 :
      d === 16 ? 3 :                                // today highlighted
      (d % 7 === 0 || d % 11 === 0) ? 2 :
      (d % 3 === 0) ? 1 : 1;
    out.push({ day: d, dow, density, today: d === 16, closed });
  }
  return out;
})();

// AI Notes — records index
const AI_NOTES = [
  { id: 'n-127', patient: 'Poppy',   owner: 'Sarah Chen',   visitType: 'Wellness · New patient', duration: '12:34', age: 'Just now', status: 'Draft'  },
  { id: 'n-126', patient: 'Mochi',   owner: 'David Liu',    visitType: 'Annual booster',          duration: '8:12',  age: '20m ago', status: 'Ready'  },
  { id: 'n-125', patient: 'Bruno',   owner: 'Priya Raman',  visitType: 'Dental cleaning',         duration: '34:50', age: '2h ago',  status: 'Signed' },
  { id: 'n-124', patient: 'Whiskey', owner: 'Maya Chen',    visitType: 'Senior wellness',         duration: '17:02', age: '1d ago',  status: 'Signed' },
  { id: 'n-123', patient: 'Nori',    owner: 'Aiden Park',   visitType: 'Lameness eval',           duration: '22:18', age: '1d ago',  status: 'Signed' },
];

// SOAP note draft for Poppy (the demo patient)
const SOAP_DRAFT = {
  noteId: 'n-127',
  patient: { name: 'Poppy', breed: 'Golden Retriever Mix', age: '2 yr', sex: 'F', weight: 24.3, microchip: '985112000789012' },
  owner:   { name: 'Sarah Chen', phone: '(503) 555-0143', email: 'sarah@example.com' },
  insurance: { provider: 'Lemonade Pet', plan: 'Plus', copay: 25, status: 'Active', preExisting: false },
  visit: { date: 'Wed Apr 16, 2026', time: '9:30 AM', clinician: 'Dr. Patel', duration: 28, room: 'Exam 2' },
  subjective: {
    chiefComplaint: 'New-patient wellness exam, vaccinations due.',
    history: "Recently adopted from Willow Creek Rescue ~2 wks ago. Owner reports normal energy, appetite, and bowel/urine. No prior records on file.",
    diet: 'Hill\'s Adult Lamb & Rice, 1.5 cups twice daily.',
  },
  objective: {
    vitals: { temp: 101.4, hr: 96, rr: 22, weight: 24.3, bcs: '5/9' },
    physical: 'Bright, alert, responsive. Mucous membranes pink, CRT <2s. Auscultation NSF. Abdomen soft, non-painful. Coat clean, no ectoparasites. Eyes/ears/oral cavity within normal limits.',
  },
  assessment: [
    { code: 'Z00.00', label: 'Routine general medical exam — healthy adult' },
  ],
  plan: [
    { line: 'DHPP booster · 1 ml SQ',                  charge: 45.00 },
    { line: 'Bordetella intranasal',                    charge: 30.00 },
    { line: 'Heartworm/parasite screen (4Dx)',          charge: 60.00 },
    { line: 'New-patient intake exam',                  charge: 35.00 },
    { line: 'Wellness exam · Dr. Patel',                charge: 95.00 },
  ],
  followUp: 'Annual wellness due Apr 2027. Heartworm/flea prevention continuing.',
  generated: 'AI-generated draft · transcribed from 12 min 34 sec session',
};

// Claims index
const CLAIMS = [
  {
    id: 'LEM-2026-04-16-001', petName: 'Poppy', owner: 'Sarah Chen',
    provider: 'Lemonade Pet · Plus', amount: 265.00, copay: 25.00, payout: 240.00,
    visit: 'Wed Apr 16, 2026 · Wellness',
    submittedAge: 'Just now', status: 'Draft', preExisting: false,
  },
  {
    id: 'LEM-2026-04-12-014', petName: 'Mochi', owner: 'David Liu',
    provider: 'Trupanion · Premium', amount: 142.00, copay: 30.00, payout: 112.00,
    visit: 'Sat Apr 12, 2026 · Vaccines',
    submittedAge: '4d ago', status: 'Pending',
    timeline: [
      { label: 'Submitted',         when: '4d ago',  done: true },
      { label: 'Under review',      when: '2d ago',  done: true },
      { label: 'Approval pending',  when: 'expected today', done: false },
      { label: 'Payout',            when: '~3 business days', done: false },
    ],
  },
  {
    id: 'HPW-2026-04-08-003', petName: 'Bruno', owner: 'Priya Raman',
    provider: 'Healthy Paws · Std', amount: 480.00, copay: 50.00, payout: 430.00,
    visit: 'Mon Apr 8, 2026 · Dental',
    submittedAge: '1w ago', status: 'Approved',
  },
  {
    id: 'TRU-2026-04-04-009', petName: 'Whiskey', owner: 'Maya Chen',
    provider: 'Trupanion · Std', amount: 220.00, copay: 220.00, payout: 0,
    visit: 'Fri Apr 4, 2026 · Senior wellness',
    submittedAge: '12d ago', status: 'Denied',
    denialReason: 'Self-pay visit · no insurance on file at time of visit.',
  },
];

const CLAIM_STAGES = [
  { key: 'Draft',    color: '#FFD400' },
  { key: 'Pending',  color: '#0034FF' },
  { key: 'Approved', color: '#00C46A' },
  { key: 'Denied',   color: '#FF5677' },
];

// Documents — file storage
const DOCUMENTS = [
  { id: 'd-001', name: 'Poppy_XRay_ChestLat.dcm', kind: 'X-ray',  size: '4.2 MB',  age: 'Just now' },
  { id: 'd-002', name: 'Poppy_4Dx_lab.pdf',         kind: 'Lab',    size: '212 KB',  age: 'Just now' },
  { id: 'd-003', name: 'Mochi_vaccine_history.pdf', kind: 'PDF',    size: '88 KB',   age: '20m ago'  },
  { id: 'd-004', name: 'Bruno_dental_pre.jpg',      kind: 'Image',  size: '1.6 MB',  age: '2h ago'   },
  { id: 'd-005', name: 'Sarah_Chen_consent.pdf',    kind: 'Consent',size: '52 KB',   age: '1d ago'   },
];

Object.assign(window, {
  CLINIC, VET_STATS, APPOINTMENTS, WEEK_VIEW, MONTH_VIEW_DATES,
  AI_NOTES, SOAP_DRAFT, CLAIMS, CLAIM_STAGES, DOCUMENTS,
});
