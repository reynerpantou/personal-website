export const profile = {
  name: 'Reyner Pantou',
  role: 'Senior Backend Engineer',
  location: 'Jakarta, Indonesia',
  email: 'reynerbpantou@gmail.com',
  linkedin: 'https://www.linkedin.com/in/reyner-pantou/',
  cv: '/cv/reyner-pantou-cv.pdf',
  description: 'Reyner Pantou is a backend engineer in Jakarta, building reliable search platforms and distributed systems with Go.',
};

export const projects = [
  {
    slug: 'commerce-search',
    number: '01',
    title: 'Search at commerce scale',
    category: 'PRODUCTION SYSTEMS',
    summary: 'Connecting search, ads, and commerce across Tokopedia and TikTok Shop.',
    tags: ['Go', 'Search', 'Distributed systems'],
    status: 'Professional work',
    intro: 'Search is where a shopper’s intent meets a marketplace. My work at Tokopedia and ByteDance focused on the backend systems behind that experience: coordinating services, integrating platforms, and making changes safely.',
    context: 'Across five years at Tokopedia and ByteDance, I worked on the search results platform and its integration with TikTok Shop. The engineering challenge was to keep a familiar shopping experience reliable while the systems underneath it evolved.',
    focus: [
      ['Service orchestration', 'Coordinate search and advertising services, then map their responses into a consistent commerce experience.'],
      ['Platform integration', 'Connect Tokopedia and TikTok Shop search flows while accounting for differences between their service contracts.'],
      ['Infrastructure migration', 'Move services to ByteCloud with attention to latency, operational behavior, and rollout safety.'],
    ],
    takeaway: 'A successful migration is more than a new endpoint. It requires clear ownership, observable behavior, and a rollout that makes failures understandable before they become widespread.',
  },
  {
    slug: 'financial-tracker',
    number: '02',
    title: 'A clearer view of everyday money.',
    category: 'IN PROGRESS',
    summary: 'Exploring a focused financial tracker, starting with the transaction ledger.',
    tags: ['Product thinking', 'Data modeling'],
    status: 'In development',
    intro: 'A personal project exploring a simple financial tracker. The first version is intentionally focused on the foundations of recording and understanding everyday transactions.',
    context: 'This is a work in progress, not a released product. The starting point is a transaction ledger and a small, understandable set of financial tracking features.',
    focus: [
      ['A focused first version', 'Prioritize the financial tracker itself before expanding into additional features.'],
      ['A sound ledger', 'Explore how transactions should be recorded, categorized, and kept consistent.'],
      ['Room to grow', 'Keep the first implementation manageable while leaving room to evolve the application as usage grows.'],
    ],
    takeaway: 'The current goal is a useful, focused first version. Implementation details and a public demo will follow as the project develops.',
  },
];
