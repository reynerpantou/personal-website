export const profile = {
  name: 'Reyner Pantou',
  role: 'Senior Backend Engineer',
  location: 'Jakarta, Indonesia',
  email: 'reynerbpantou@gmail.com',
  linkedin: 'https://www.linkedin.com/in/reyner-pantou/',
  cv: '/cv/reyner-pantou-cv.pdf',
  description: 'Senior backend engineer specialising in the user-facing search API layer: Search API, Search Provider for engine aggregation, and Search Pack for item and component packing. Five years at Tokopedia and ByteDance with Go.',
  introduction: 'Five years at Tokopedia and ByteDance. I owned the user-facing search API layer at TikTok: Search API, Search Provider for engine aggregation, and Search Pack for item and component packing. My responsibility ran from service design and stakeholder alignment through implementation, rollout, and monitoring.',
};

export const serviceScope = [
  ['Search API', 'The user-facing API service that coordinates search requests and returns the search experience.'],
  ['Search Provider', 'The engine aggregator that integrates TikTok organic and advertising engines.'],
  ['Search Pack', 'The item and component packer that assembles product, video, store, advertising, and promotion content.'],
];

export const highlights = [
  { value: '+18.5%', label: 'Reported search GMV growth', context: 'May vs. April, 2024 integration' },
  { value: '−55%', label: 'Annual search API hosting cost', context: '2025 migration, rounded from 54.68%' },
  { value: '14+', label: 'Squads coordinated', context: '2023 legacy API migration' },
];

export const responsibilities = [
  ['API-layer ownership', 'Define contracts and service boundaries for Search API, Search Provider, and Search Pack, and remain accountable from design review through rollout.'],
  ['Search experience', 'Integrate organic and ad engines, filters, sorting, product/video/store cards, and promotion display, popups, and claims.'],
  ['Tracking and governance', 'Handle engine impressions and event tracking, blacklists, interventions, and product-status and moderation handling.'],
  ['Architecture and delivery', 'Separate API orchestration, engine aggregation, and component packing, and plan migrations with testing and rollback paths.'],
  ['Cross-team execution', 'Align Product, Backend, Frontend, QA, Data Science, Ads, and platform teams on dependencies, delivery plans, and changing priorities.'],
  ['Experiments and operations', 'Implement experiment controls and monitoring, operate rollouts, partner on result interpretation, and investigate production incidents.'],
  ['Engineering leadership', 'Write technical designs, review code, mentor engineers, interview candidates, and share platform knowledge across teams.'],
];

export const experience = [
  {
    company: 'ByteDance',
    role: 'Senior Software Engineer · Search',
    dates: '2024 — 2026',
    scope: 'Search API, Search Provider, and Search Pack',
    description: 'Owned the user-facing search API layer and its organic/ad engine integrations, ByteCloud migration, and commerce features. Coordinated service delivery with Product, Frontend, QA, Data Science, Ads, and platform teams.',
    areas: [
      'Search Provider: aggregate TikTok organic and advertising engines; handle engine impressions and event tracking.',
      'Search API and Search Pack: filters and sorting; product, video, store, and advertising cards; promotion display, popups, and claims.',
      'Governance: blacklists, interventions, and product-status and moderation handling.',
    ],
  },
  {
    company: 'Tokopedia',
    role: 'Software Engineer · Search',
    dates: '2021 — 2023',
    scope: 'Search APIs, retrieval, and relevance features',
    description: 'Served as engineering PIC for search product-card redesign, Elasticsearch optimization, and migrations across more than 14 squads. Built reusable query and cache abstractions, strengthened integration testing, and supported production operations.',
    areas: [
      'Search APIs: product cards, advertisements, filters, sorting, and fine-ranking behavior across Search Result Page, store page, grocery, discovery, and other surfaces.',
      'Retrieval, fine ranking with boost/deboost, NLP, and blacklist handling.',
      'Limited ingestion-service contributions to process product information before Elasticsearch indexing.',
    ],
  },
];

export const leadership = [
  { value: '696', label: 'Code reviews in 2023' },
  { value: '2', label: 'Architecture Review Board presentations' },
  { value: '2025', label: 'ByteDance Spot Award' },
];

export const projects = [
  {
    slug: 'commerce-search',
    number: '01',
    icon: 'search',
    title: 'Tokopedia × TikTok Shop search',
    category: 'Search integration',
    summary: 'Integrated a new search engine without losing Tokopedia’s filters, sorting, or commerce experience.',
    tags: ['Go', 'Search integration', 'Experimentation'],
    status: 'Delivered',
    intro: 'Core engineer for the API-layer integration between Tokopedia and TikTok Shop search, with direct ownership of filter contracts and implementation. I later led the search-provider RPC and traffic-boost integration and extended the API experience across search surfaces.',
    context: 'The initial online integration had a deadline of one month or less. Tokopedia’s complex filters and existing shopping experience had to work with a different search engine, service contract, and experimentation platform.',
    metrics: [
      { value: '+18.5%', label: 'Search GMV', context: 'May vs. April, 2024' },
      { value: '+13.21%', label: 'Search OPMS', context: 'Same monthly comparison' },
      { value: '+24.32%', label: 'Search unique visitors', context: 'Same monthly comparison' },
    ],
    business: [
      'The 2024 integration report recorded search GMV growth of 18.5%, monthly buying users of 12.55%, and unique visitors of 24.32% in May versus April.',
      'Later store-card integration reported GMV improvements of 4.5–6.6%. Desktop integration reported a 2.63% increase in search GMV per search user. These are separate initiatives and measurement scopes.',
    ],
    technical: [
      'Delivered the initial online integration within a month and migrated the subsequent search-provider flow with zero reported downtime.',
      'Built filter expressions, search RPC contracts, experiment controls, debug logging, and latency/success-rate monitoring.',
      'Extended the integration to desktop, shop-page search, store cards, and synchronized filters and quick filters.',
    ],
    ownership: [
      'Main point of contact for the initial filter implementation, working with TikTok Shop engineers to preserve Tokopedia’s complex filter behavior.',
      'Owned technical design, planning, and implementation of the later search RPC and traffic-boost integration.',
      'Coordinated API contracts, integration testing, and rollout with Search Architecture, Frontend, QA, and algorithm teams.',
    ],
    focus: [
      ['Contract compatibility', 'Mapped Tokopedia’s shopping and filter requirements into the new engine’s request and response contracts.'],
      ['Observable migration', 'Introduced experiment routing and monitoring so the team could check behavior while replacing the old search-provider flow.'],
      ['Consistent discovery', 'Carried the integration across search surfaces while keeping pagination, sorting, and filter behavior coherent.'],
    ],
    evidence: 'Reported project outcomes from 2024–2025 performance records. The May-versus-April figures are a monthly comparison, not an isolated causal A/B result. Later store-card and desktop figures belong to separate experiments.',
    takeaway: 'My ownership covered API-layer implementation, engine integration contracts, coordination, and rollout accountability across two platforms.',
  },
  {
    slug: 'search-platform-migration',
    number: '02',
    icon: 'platform',
    title: 'A simpler search API layer',
    category: 'Architecture and migration',
    summary: 'Migrated Search API to ByteCloud and separated Search Provider engine aggregation from Search Pack item and component packing.',
    tags: ['Go', 'Kitex', 'Cloud migration'],
    status: 'Delivered',
    intro: 'Owned re-architecture and cutover of the search API layer for the GCP-to-ByteCloud migration. The service boundaries were Search API for user-facing orchestration, Search Provider for engine aggregation, and Search Pack for item and component packing. I took the new services through stress testing and full rollout.',
    context: 'The existing search service mixed API orchestration, engine integration, and product-card logic. Moving platforms also created an opportunity to separate responsibilities and make changes easier to test, deploy, and diagnose.',
    metrics: [
      { value: '−54.68%', label: 'Annual hosting cost', context: 'Reported before/after search API cost' },
      { value: '−350 ms', label: 'Search Result Page latency', context: '1,200 ms to 850 ms' },
      { value: '0', label: 'Reported cutover downtime', context: 'Search service migration' },
    ],
    business: [
      'Reported annual search API hosting cost fell by approximately $86,845. This reflects the combined effect of service improvements, re-architecture, and platform pricing.',
      'Kept search product, shop-page product, and shop-query functionality available through the migration.',
    ],
    technical: [
      'Reduced reported Search Result Page latency from 1,200 ms to 850 ms, a 350 ms reduction.',
      'Built Search Provider for organic/ad engine aggregation and Search Pack for item and component packing, enabling pack features to deploy independently of Search API.',
      'Created a shared service boilerplate, debugging utilities, dashboards, stress tests, and rollout monitoring. Performance records estimate two engineering days saved per engine or product-pack feature.',
    ],
    ownership: [
      'Created the architecture, migration strategy, and cutover plan for the search API layer.',
      'Served as main point of contact for Search Provider and Search Pack, implementing them and monitoring the rollout to 100%.',
      'Coordinated QA and Ads engineering to check both organic and advertising behavior during the transition.',
    ],
    focus: [
      ['Service boundaries', 'Separated Search API orchestration, Search Provider engine aggregation, and Search Pack item/component assembly.'],
      ['Safe cutover', 'Planned migration steps and monitored search behavior across the affected surfaces.'],
      ['Operational clarity', 'Used service-specific dashboards and debug tools to make ownership and issue diagnosis clearer.'],
    ],
    evidence: 'Before/after results from 2025 performance records. Cost savings combine engineering changes and platform pricing. Engineering-day savings are estimates; downtime refers to the reported cutover.',
    takeaway: 'The migration reduced operating cost while giving the team clearer service ownership and independent deployment paths.',
  },
  {
    slug: 'search-performance',
    number: '03',
    icon: 'database',
    title: 'Lower-cost, faster search',
    category: 'Performance and infrastructure',
    summary: 'Optimized Elasticsearch queries, index mappings, and cache behavior as part of the search cost program.',
    tags: ['Elasticsearch', 'Redis', 'Performance'],
    status: 'Delivered',
    intro: 'Engineering PIC for non-performing-product and index-mapping initiatives within the Elasticsearch cost optimization program. My related work improved cache efficiency and supported Elasticsearch upgrades and cluster scaling.',
    context: 'Expensive queries, unnecessary indexed fields, and oversized cache keys were increasing the operating cost of search. The changes needed to preserve relevance and production behavior while reducing infrastructure work.',
    metrics: [
      { value: '−40%', label: 'Elasticsearch monthly spend', context: '2023 team optimization program' },
      { value: '$24K', label: 'Monthly savings reported', context: 'Same program, not extra savings' },
      { value: '11–21%', label: 'Lower Redis memory usage', context: '2022 filter-cache improvement' },
    ],
    business: [
      'The combined Elasticsearch optimization program reported a 40% reduction in monthly spend, equivalent to $24,000 per month.',
      'Cache improvements reduced reported Redis memory usage by 1.7–3.3 GB and removed related critical memory alerts during the observed period.',
    ],
    technical: [
      'Reviewed 64 potential Elasticsearch queries or fields and finalized index-mapping changes. The overall program freed 192 CPU cores.',
      'The 2023 record describes search endpoint latency changing from peaks of 370 ms to a stable approximately 100 ms. These are different measurement descriptions, not a like-for-like percentile benchmark.',
      'Introduced partial caching and expiry jitter, then Redis hashes and shorter keys. A separate 2022 comparison reported average p95 Elasticsearch latency falling from 168 ms to 152 ms.',
      'Led the search service’s Elasticsearch 6-to-7 migration and participated in or executed four cluster-scaling operations.',
    ],
    ownership: [
      'PIC for non-performing-product and index-mapping initiatives, coordinating mapping reviews, scripts, testing, and migration plans.',
      'Implemented cache changes and reusable Redis abstractions with optional circuit breakers, metrics, and pipeline support.',
      'Worked with platform and search engineers on scaling, mitigation plans, and production execution.',
    ],
    focus: [
      ['Reduce unnecessary work', 'Removed unneeded indexing and query costs while checking the queries used by downstream services.'],
      ['Cache deliberately', 'Changed cache granularity and expiry behavior, then addressed the memory trade-off with hashes and shorter keys.'],
      ['Preserve behavior', 'Used comparison scripts, testing, and coordinated production execution for version and mapping changes.'],
    ],
    evidence: '2022–2023 calibration records. The 40%, $24K, and 192-core results belong to the combined team program. Redis results are a separate initiative; latency comparisons retain their original scopes.',
    takeaway: 'I connect performance work to infrastructure cost and production behavior, including the trade-offs introduced by an optimization.',
  },
  {
    slug: 'search-monetization',
    number: '04',
    icon: 'ads',
    title: 'Ads inside commerce search',
    category: 'Monetization',
    summary: 'Enabled TikTok advertising on Tokopedia search while preserving organic results and legacy ads.',
    tags: ['Go', 'Ads integration', 'Latency'],
    status: 'Delivered',
    intro: 'Main search-side point of contact for TikTok Ad Manager integration and later pseudo-ad delivery. I owned design and implementation across the relevant search servers while coordinating with Ads engineering, Product, Frontend, and QA.',
    context: 'The advertising transition had to keep legacy Tokopedia ads discoverable, introduce TikTok ads, and preserve the organic search experience. Latency and independent pagination of organic and ad results were important constraints.',
    metrics: [
      { value: '+21.69%', label: 'Pseudo-ad GMV', context: 'Reported 2025 experiment, rounded' },
      { value: '+49.09%', label: 'Pseudo-ad delivery', context: 'Ad-send metric, same experiment' },
      { value: '+6.67%', label: 'Normal-ad GMV', context: 'Separate reported ads result' },
    ],
    business: [
      'The 2025 ads results reported pseudo-ad GMV growth of 21.692% and ad-send growth of 49.092%. Normal ads reported GMV growth of 6.665% and ad-send growth of 7.897%.',
      'Enabled the transition to TikTok Ad Manager while keeping Tokopedia’s existing ads discoverable.',
    ],
    technical: [
      'Integrated the ad manager across Search API and Search Provider, introduced independent organic and advertising cursors, and handled engine impressions and event tracking.',
      'The CV reports limiting a projected 506 ms latency increase to 185 ms; the 2024 performance record separately confirms mitigation of the projected regression.',
      'Performance records estimate two to three engineering days saved when creating or maintaining the new ad flow.',
    ],
    ownership: [
      'Owned search-side technical design, delivery planning, coordination, and implementation on both search-server sides.',
      'Initiated an ecommerce search RPC to allow early ad testing before the broader search API migration.',
      'Owned strategies and implementation for pseudo-ad integration, working with Ads engineering and QA to validate delivery.',
    ],
    focus: [
      ['A controlled transition', 'Kept old and new ad flows available during experiment-driven migration.'],
      ['Separate result streams', 'Implemented independent cursors so organic and ad pools could paginate without excluding either stream.'],
      ['Latency-aware design', 'Reworked the integration path to limit additional request time.'],
    ],
    evidence: '2024–2025 performance records and the supplied CV. GMV and ad-send outcomes are experiment results for the delivered integrations, not revenue attributable solely to one engineer. The actual 185 ms overhead is CV-reported.',
    takeaway: 'I owned monetization integration while managing backend compatibility and latency constraints.',
  },
  {
    slug: 'commerce-experience',
    number: '05',
    icon: 'card',
    title: 'Product cards that convert',
    category: 'Product and growth',
    summary: 'Standardized product-card contracts and delivered pricing, promotion, coupon, and discovery features.',
    tags: ['API design', 'Product growth', 'A/B rollout'],
    status: 'Delivered',
    intro: 'Owned the backend and cross-platform contracts for Tokopedia’s product-card redesign, then led search-side delivery of pricing, coupon, promotion, and discovery initiatives. The work connected backend implementation to measurable shopping outcomes.',
    context: 'Inconsistent product-card contracts and promotion logic created coordination and maintenance costs. New commerce benefits also had to appear correctly across search surfaces without introducing unacceptable latency or rollout risk.',
    metrics: [
      { value: '+1.17%', label: 'Paid-order conversion', context: '2023 product-card redesign result' },
      { value: '+11.06%', label: 'Search GMV', context: '2025 high-value-user coupon test' },
      { value: '+10.87%', label: 'Average order value', context: 'Same coupon test' },
    ],
    business: [
      'The 2023 product-card redesign reported paid-order conversion growth of 1.17%, add-to-cart conversion of 1.48%, and clicks per session of 3.05%.',
      'The 2025 high-value-user coupon experiment reported search GMV growth of 11.06% and average order value of 10.87%. A separate query-based coupon experiment reported GMV per user growth of 1.91%.',
      'The 2024 price-center integration reported GMV growth of 11% and conversion growth of 1.97%. Shop-page recommendation work separately reported shop GMV growth of 7.75%.',
      'The supplied CV reports 2026 bonus-promotion A/B wins of GMV per user +3.1% and main orders per user +5.7%, plus instant/same-day delivery labels with order rate +1.1%.',
    ],
    technical: [
      'Defined and implemented a new search product API contract with Android, iOS, desktop, and Ads teams. Organic and advertising product cards used the same contract.',
      'Integrated pricing and promotion across three search modules, proactively tested six APIs, and kept reported search latency below 550 ms for that integration.',
      'Handled promotion display, popups, and claims, as well as product, video, store, and advertising-card assembly in the API layer.',
      'Implemented recommendation decompression, deduplication, and sorting, as well as configurable campaign banners and experiment controls.',
    ],
    ownership: [
      'PIC for the product-card redesign: finalized request/response contracts, tracked frontend adoption, and implemented the backend API.',
      'Main point of contact for coupon initiatives, independently developing the search-side feature and aligning Product, Data Science, Promotion, and QA.',
      'Owned search-side pricing integration and took campaign and discovery features through testing and experiment rollout.',
    ],
    focus: [
      ['Shared product contracts', 'Centralized the product-card response to reduce platform-specific behavior and repeated maintenance.'],
      ['Benefits shoppers can use', 'Integrated personalized coupons, net pricing, promotion labels, and discovery behavior into the existing search journey.'],
      ['Measured delivery', 'Operated technical rollouts and partnered with Product and Data Science on experiment results and shipping decisions.'],
    ],
    evidence: '2023 calibration, 2024–2025 performance records, and CV-reported 2026 results. Each uplift belongs to its named initiative and denominator. Percentages are not cumulative and are not added together.',
    takeaway: 'My product work covers the contract, implementation, rollout, and measured outcome, with direct collaboration across engineering and commercial teams.',
  },
  {
    slug: 'search-reliability',
    number: '06',
    icon: 'shield',
    title: 'Safer changes, clearer ownership',
    category: 'Reliability and leadership',
    summary: 'Led migrations across downstream teams, handled urgent policy incidents, and strengthened engineering quality.',
    tags: ['Migration planning', 'Incident response', 'Mentoring'],
    status: 'Delivered',
    intro: 'Owned production changes whose success depended on more than the implementation: downstream migrations, search content controls, codebase modernization, testing standards, and engineering reviews.',
    context: 'Search served many downstream teams and multiple customer surfaces. Legacy contracts, policy-sensitive queries, and growing technical debt required explicit coordination, operational responsibility, and careful validation.',
    metrics: [
      { value: '14+', label: 'Squads coordinated', context: '2023 endpoint migration' },
      { value: '<1 hour', label: 'Urgent policy fix delivered', context: '2024 app-store compliance incident' },
      { value: '696', label: 'Code reviews', context: '2023 calibration record' },
    ],
    business: [
      'Resolved a P0 search-content incident in under an hour; the performance record states that the fix prevented app-store blocking or removal.',
      'Enabled downstream teams to move off legacy contracts without reported downtime and supported campaign and production operations.',
    ],
    technical: [
      'Migrated seven legacy endpoints and redirected seven GraphQL queries across more than 14 squads, using downstream trackers, migration guides, war rooms, and mitigation plans.',
      'Removed more than 100 feature flags, 25 experiments, and five dependencies. The 2025 record reports CPU utilization down 19%, memory down 17%, and disk down 22% across a 20-host fleet, with no P0/P1 regressions reported for that work.',
      'Implemented query and phrase blacklists, negative-category filtering, and PII redaction. Standardized integration-test naming, assertions, and test data.',
    ],
    ownership: [
      'PIC for downstream migration planning and execution, following up consumers and tracking compatibility through production cutover.',
      'Main point of contact for the urgent content-policy fix and API-layer search governance: blacklists, interventions, and product-status and moderation handling.',
      'Reviewed code, mentored engineers, interviewed backend candidates, and presented twice at the Architecture Review Board. Received a ByteDance Spot Award in 2025.',
    ],
    focus: [
      ['Migration as a program', 'Identified consumers, agreed timelines, tracked adoption, and communicated each production step.'],
      ['Operational accountability', 'Investigated escalations and shipped urgent safeguards while preserving search behavior.'],
      ['A stronger engineering baseline', 'Introduced reusable abstractions, testing standards, and review practices that other engineers could follow.'],
    ],
    evidence: '2022–2023 calibration records, 2024–2025 performance records, and CV. The endpoint counts describe the 2023 migration; the separate 2022 deprecation is not added to that count. Resource reductions are reported fleet-level comparisons.',
    takeaway: 'I stay accountable for adoption, production safety, and the team’s ability to maintain what we ship.',
  },
];
