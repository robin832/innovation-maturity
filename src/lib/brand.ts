/**
 * The Beacon — Brand Configuration
 * Single source of truth for all brand details, colors, and offerings.
 */

export const BRAND = {
  name: "The Beacon",
  tagline: "Innovation Ecosystem · Antwerp",
  website: "https://thebeacon.be",
  email: "hello@thebeacon.be",
  address: "The Beacon, Ellermanstraat 15, 2060 Antwerp",
  calendly: "https://calendly.com/thebeacon/discovery",

  colors: {
    amber:  "#FCC287", // warm highlight, tag accents
    orange: "#E36037", // primary CTA, interactive
    blue:   "#00ACD9", // secondary accent, links, scores
    ivory:  "#FFFFF0", // primary text on dark
    dark:   "#07242D", // page background
    card:   "#0D3540", // card background
    muted:  "#1A4A58", // muted backgrounds
    border: "#1E5468", // subtle borders
  },

  /** Innovation Maturity dimensions — order matters for display */
  maturityDimensions: [
    {
      key: "rd_investment",
      label: "R&D & Technology Investment",
      weight: 0.25,
      description:
        "Measures commitment to research, patents, technology hiring, and innovation budget allocation.",
    },
    {
      key: "product_innovation",
      label: "Product & Service Innovation",
      weight: 0.25,
      description:
        "Tracks new product launches, service evolution, and market-creating innovations.",
    },
    {
      key: "digital_transformation",
      label: "Digital Transformation",
      weight: 0.20,
      description:
        "Evaluates adoption of digital tools, data strategy, automation, and platform thinking.",
    },
    {
      key: "partnerships_ecosystem",
      label: "External Partnerships & Ecosystem",
      weight: 0.15,
      description:
        "Assesses open innovation, startup collaboration, and external ecosystem engagement.",
    },
    {
      key: "market_vision",
      label: "Market Leadership & Vision",
      weight: 0.15,
      description:
        "Reflects market position, innovation narrative strength, and forward-looking strategy.",
    },
  ],

  maturityLevels: [
    { min: 0,   max: 1.4, label: "Innovation Laggard",   color: "#6B7280" },
    { min: 1.5, max: 2.4, label: "Innovation Follower",  color: "#F59E0B" },
    { min: 2.5, max: 3.4, label: "Innovation Active",    color: "#00ACD9" },
    { min: 3.5, max: 4.4, label: "Innovation Leader",    color: "#E36037" },
    { min: 4.5, max: 5.0, label: "Innovation Pioneer",   color: "#FCC287" },
  ],

  /** All memberships — no pricing exposed in UI */
  memberships: [
    {
      id: "explore-partnership",
      name: "Explore Partnership",
      type: "industrial" as const,
      tagline: "Discover the ecosystem",
      description:
        "Entry point into The Beacon's innovation ecosystem. Gain access to community events, curated matchmaking, and quarterly innovation briefings tailored to your sector.",
      benefits: [
        "Access to The Beacon innovation community",
        "Curated matchmaking with tech scale-ups & startups",
        "Quarterly innovation sector briefings",
        "Invitation to open community events",
      ],
    },
    {
      id: "engage-partnership",
      name: "Engage Partnership",
      type: "industrial" as const,
      tagline: "Activate innovation",
      description:
        "Go beyond networking. Participate in structured innovation programs, co-create with technology partners, and gain priority access to The Beacon's matchmaking engine.",
      benefits: [
        "Everything in Explore Partnership",
        "Participation in Innovation Challenges",
        "Priority matchmaking & tech scouting sessions",
        "Access to co-creation programs",
        "Facilitated introductions to strategic tech partners",
      ],
    },
    {
      id: "strategic-partnership",
      name: "Strategic Innovation Partnership",
      type: "industrial" as const,
      tagline: "Transform together",
      description:
        "A dedicated innovation relationship. A Beacon innovation manager works alongside your team to design and execute a custom innovation roadmap leveraging the full ecosystem.",
      benefits: [
        "Everything in Engage Partnership",
        "Dedicated Beacon innovation manager",
        "Custom innovation roadmap design",
        "Executive networking & thought leadership opportunities",
        "Innovation board participation",
        "Bespoke co-creation programs",
      ],
    },
    {
      id: "tech-starter",
      name: "Tech Starter Membership",
      type: "technology" as const,
      tagline: "Launch from Antwerp",
      description:
        "For early-stage startups (< 5 years, ≤ 10 employees) ready to grow within a thriving innovation ecosystem and connect with established industry players.",
      benefits: [
        "Community access & shared workspace",
        "Mentoring sessions with Beacon advisors",
        "Event invitations & visibility opportunities",
        "Introduction to relevant industry players",
      ],
    },
    {
      id: "tech-member",
      name: "Tech Membership",
      type: "technology" as const,
      tagline: "Scale with purpose",
      description:
        "For growing tech companies ready to deepen industry relationships, access flexible office space, and establish themselves as credible innovation partners.",
      benefits: [
        "Everything in Tech Starter",
        "Flexible office & meeting room access",
        "Facilitated introductions to industry members",
        "Partnership facilitation support",
        "Increased event & program access",
      ],
    },
    {
      id: "tech-champion",
      name: "Tech Champion Membership",
      type: "technology" as const,
      tagline: "Lead the ecosystem",
      description:
        "For established tech leaders who want to shape the innovation agenda, engage at executive level, and become a cornerstone of The Beacon's ecosystem.",
      benefits: [
        "Everything in Tech Membership",
        "Thought leadership & speaking opportunities",
        "Strategic access to C-level industry executives",
        "Innovation board participation",
        "Custom engagement programs",
      ],
    },
  ],

  /** À la carte services */
  services: [
    {
      id: "innovation-challenge",
      name: "Innovation Challenge",
      icon: "🎯",
      description:
        "A structured 8-week program to solve a defined business challenge by matching your team with handpicked technology startups. Results in concrete pilots or PoCs.",
    },
    {
      id: "inspiration-sessions",
      name: "Inspiration Sessions",
      icon: "💡",
      description:
        "Curated half-day sessions bringing your leadership team face-to-face with innovators, technology leaders, and disruptors relevant to your sector.",
    },
    {
      id: "tech-tours",
      name: "Tech Tours",
      icon: "🔭",
      description:
        "Guided visits to cutting-edge innovation hubs, technology labs, and scale-up offices — in Antwerp and beyond — tailored to your strategic themes.",
    },
    {
      id: "cocreation",
      name: "Co-Creation Programs",
      icon: "🤝",
      description:
        "Structured multi-session co-creation between your team and selected technology partners, designed to produce tangible innovation outputs.",
    },
    {
      id: "innovation-day",
      name: "Innovation Day",
      icon: "🚀",
      description:
        "A fully immersive full-day experience at The Beacon combining inspiration, matchmaking, workshops, and a showcase of ecosystem partners — tailored to your company's challenges.",
    },
  ],

  /** Space images — replace with actual Beacon building photos */
  spaceImages: [
    {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      alt: "The Beacon — Main Innovation Hall",
      caption: "Main Innovation Hall",
    },
    {
      url: "https://images.unsplash.com/photo-1497366754035-f200968a5c52?w=800&q=80",
      alt: "The Beacon — Meeting Rooms",
      caption: "Collaboration Rooms",
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      alt: "The Beacon — Workshop Space",
      caption: "Workshop & Event Space",
    },
    {
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      alt: "The Beacon — Rooftop & Terrace",
      caption: "Rooftop Terrace",
    },
  ],
} as const;

export type CompanyType = "industrial" | "technology";
export type MembershipType = typeof BRAND.memberships[number];
export type ServiceType = typeof BRAND.services[number];
