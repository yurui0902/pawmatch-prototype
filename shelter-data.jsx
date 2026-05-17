// shelter-data.jsx — mock data for the shelter / breeder app.
// Sarah Chen's application for Poppy crosses both ends, so the demo can
// flip between adopter and shelter views of the same story.

const SHELTER = {
  name: 'Willow Creek Rescue',
  operator: 'Meadow Park',
  district: 'NW Portland · 1842 NE 23rd',
  verified: true,
  joinedYear: 2018,
  categories: ['Dogs', 'Cats'],
  totalActive: 4,
  totalAlumni: 387,
};

// Pets the shelter is currently managing. Keys match adopter-side FEED where
// applicable (poppy + max are Willow Creek pets). Extras are shelter-only.
const SHELTER_PETS = [
  {
    key: 'poppy', name: 'Poppy', breed: 'Golden Retriever Mix', age: '2 yr', kind: 'dog',
    status: 'Live', appCount: 6, swipes: 284, likes: 42, likeRate: 0.148, fee: 250,
    requirements: ['Kids OK', 'Fenced yard', 'Dog-experienced'],
    description: "Energetic, kid-friendly, house-trained. Loves long walks and the couch in equal measure.",
    medical: 'Fully vaccinated · Spayed · Microchipped',
  },
  {
    key: 'max', name: 'Max', breed: 'Labrador Retriever', age: '5 yr', kind: 'dog',
    status: 'Live', appCount: 2, swipes: 96, likes: 11, likeRate: 0.115, fee: 220,
    requirements: ['Fenced yard', 'Large-dog space', 'Daily exercise'],
    description: "Trained, loyal, fetch pro. Took manners class and asks for refreshers.",
    medical: 'Fully vaccinated · Neutered',
  },
  {
    key: 'biscuit', name: 'Biscuit', breed: 'Border Collie Mix', age: '3 yr', kind: 'dog',
    status: 'Draft', appCount: 0, swipes: 0, likes: 0, likeRate: 0, fee: 195,
    requirements: ['Active home', 'Fenced yard'],
    description: "Smart, busy, needs a job. New intake — photos and bio still in progress.",
    medical: 'Intake exam pending',
  },
  {
    key: 'sage', name: 'Sage', breed: 'Lab/Hound Mix', age: '7 yr', kind: 'dog',
    status: 'Paused', appCount: 4, swipes: 132, likes: 19, likeRate: 0.144, fee: 150,
    requirements: ['Calm home', 'Senior-friendly', 'No stairs'],
    description: "Sweet older girl, looking for a slow-paced retirement home.",
    medical: 'Vaccinated · On joint supplement',
  },
];

// Applications across stages. Sarah Chen → Poppy is the load-bearing one.
const APPLICATIONS = [
  {
    id: 'a1',
    applicant: 'Sarah Chen',
    initials: 'SC',
    petKey: 'poppy',
    household: 'Family w/ kids',
    location: 'Portland, OR · 1.2 mi',
    age: '2h',
    stage: 'pre-app',                       // pre-app | meeting | met | approved
    preApp: {
      whyAdopt:  "We've been looking for a calm, family-friendly dog for almost a year. The kids are 7 and 10 and have asked weekly. We finally feel ready.",
      favorite:  "Her bio says she loves walks but also nap time — that's our whole family in two sentences.",
      fit:       "We're in a single-family home with a fenced yard. I work hybrid so someone is home most days.",
    },
    fullForm: {
      adults: '2',  children: '2 (ages 7, 10)',
      home: 'Own · single-family',
      yard: 'Fully fenced',
      otherPets: 'None currently · cat passed last year',
      vet: { name: 'Forest Park Veterinary', dr: 'Dr. Patel', inNetwork: true },
      routine: 'Walks at 7am and 6pm. Dog joins the family during work-from-home days. Boarded with vet on travel.',
      experience: 'Owned a Border Collie mix for 11 years',
    },
    aiChecks: [
      { label: 'Shelter registered on PawMatch', ok: true },
      { label: "Form matches Willow Creek's template", ok: true },
      { label: 'Record found (Poppy → Sarah Chen)', ok: true },
    ],
    insurance: { provider: 'Lemonade Plus', monthly: 67.74, active: true },
    vetVisit:  { clinic: 'Forest Park Veterinary', when: 'Wed Apr 16 · 9:30 AM', confirmed: true },
    homeVisit: { scheduled: 'Sat Apr 19 · 2:00 PM', completed: false },
  },
  {
    id: 'a2', applicant: 'Jordan Pham', initials: 'JP', petKey: 'max',
    household: 'Couple', location: 'NE Portland · 3.2 mi', age: '5h', stage: 'scheduled',
    preApp: {
      whyAdopt: 'We have the time and space and Max looks like a champ.',
      favorite: 'A trained lab is a dream — we want to keep his manners class going.',
      fit: 'Big yard, no kids yet, both work hybrid.',
    },
    fullForm: { adults: '2', children: '0', home: 'Own · ranch', yard: 'Fully fenced', otherPets: 'None',
                vet: { name: 'Pearl District Animal Hospital', dr: 'Dr. Nguyen', inNetwork: true },
                routine: 'Morning jog plus evening park visit.', experience: 'Foster volunteer for 3 years' },
    aiChecks: [
      { label: 'Shelter registered on PawMatch', ok: true },
      { label: "Form matches Willow Creek's template", ok: true },
      { label: 'Record found (Max → Jordan Pham)', ok: true },
    ],
  },
  {
    id: 'a3', applicant: 'Priya Raman', initials: 'PR', petKey: 'sage',
    household: 'Single', location: 'SE Portland · 4.5 mi', age: '1d', stage: 'meeting',
    preApp: {
      whyAdopt: 'A calm senior is exactly what my apartment needs.',
      favorite: 'I love that she just wants company — same.',
      fit: 'One-bedroom apartment, no stairs, work from home.',
    },
    fullForm: { adults: '1', children: '0', home: 'Rent · ground floor', yard: 'No, but small patio', otherPets: 'None',
                vet: { name: 'Hawthorne Vet Clinic', dr: 'Dr. Chen', inNetwork: true },
                routine: 'Two short walks daily, lots of couch time.', experience: 'Volunteer at OHS' },
    aiChecks: [
      { label: 'Shelter registered on PawMatch', ok: true },
      { label: "Form matches Willow Creek's template", ok: true },
      { label: 'Record found (Sage → Priya Raman)', ok: true },
    ],
    homeVisit: { scheduled: 'Sun Apr 14 · 11:00 AM', completed: true, notes: 'Quiet apartment, all checks passed.' },
  },
  {
    id: 'a4', applicant: 'Marcus Lee', initials: 'ML', petKey: 'poppy',
    household: 'Family w/ kids', location: 'SW Portland · 2.7 mi', age: '4h', stage: 'pre-app',
    preApp: {
      whyAdopt: 'Our kids have been begging for a dog and Poppy looks like the one.',
      favorite: 'House-trained — we like Poppy is already polite.',
      fit: 'Backyard with fence, three kids ages 6-12.',
    },
  },
];

// Shelter-side conversation list. Sarah Chen's thread is the demo.
const SHELTER_CHATS = [
  { who: 'Sarah Chen',   sub: 'About Poppy 🐕', petKey: 'poppy', preview: 'Saturday 2pm works for us.',         age: '2h',  unread: 1 },
  { who: 'Jordan Pham',  sub: 'About Max 🐕',   petKey: 'max',   preview: "Can we bring our parents to meet?",   age: '5h',  unread: 0 },
  { who: 'Priya Raman',  sub: 'About Sage 🐕',  petKey: 'sage',  preview: 'Home visit went really well, thanks.', age: '1d',  unread: 0 },
  { who: 'Marcus Lee',   sub: 'About Poppy 🐕', petKey: 'poppy', preview: "Just submitted — looking forward.",   age: '4h',  unread: 1 },
];

// Top-level stats for the Home dashboard
const SHELTER_STATS = {
  adoptedThisMonth: 12, adoptedDelta: 0.18,
  pendingApplications: APPLICATIONS.length,
  totalSwipesWeek: 1248,
  totalLikesWeek: 184,
};

const APP_STAGES = [
  { key: 'pre-app',   label: 'Pre-app',   color: '#FFD400' },
  { key: 'scheduled', label: 'Scheduled', color: '#FF0083' },   // was Meeting
  { key: 'meeting',   label: 'Meeting',   color: '#0034FF' },   // was Met
  { key: 'approved',  label: 'Approved',  color: '#00C46A' },
];

Object.assign(window, { SHELTER, SHELTER_PETS, APPLICATIONS, SHELTER_CHATS, SHELTER_STATS, APP_STAGES });
