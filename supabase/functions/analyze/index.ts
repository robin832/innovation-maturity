import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
});

// ─── Prompts ─────────────────────────────────────────────────────────────────

const ANALYST_SYSTEM_PROMPT = `You are an expert innovation analyst for The Beacon, a leading innovation ecosystem based in Antwerp, Belgium. The Beacon connects established industry players (industrial companies) with technology scale-ups and startups to accelerate innovation.

Your role: analyze companies based ONLY on publicly available information — annual reports, press releases, LinkedIn, job postings, GitHub, news articles, investor relations pages, product documentation.

CRITICAL RULES:
1. NEVER fabricate or invent information. If something is not publicly documented, say so explicitly.
2. Strategic goals: ONLY include goals explicitly stated in public documents. Always cite the source (e.g. "Annual Report 2024", "Press release Jan 2025", "CEO interview Bloomberg"). If no publicly stated goals are found, return an empty array and set strategicGoalsNote to explain.
3. Technology stack: infer conservatively from job postings, GitHub, tech blog posts, product pages. Only include technologies you have reasonable evidence for.
4. Innovation maturity scores must reflect reality. A score of 3.0/5 is respectable and honest. Do not inflate scores for well-known brands.
5. Active projects: only include publicly announced or reported projects. Cite sources.
6. Assess "industrial" vs "technology" company type: industrial = primarily a product/service company in a traditional sector; technology = primarily a tech product or software company.
7. beaconMatchRationale: explain specifically WHY The Beacon ecosystem adds value for THIS company — reference their specific gaps, tech needs, or strategic themes.

Score each dimension on a 0–5 scale in 0.5 increments. Be critical and honest.`;

const MATCHMAKER_SYSTEM_PROMPT = `You are The Beacon's ecosystem matchmaker. The Beacon is an innovation hub in Antwerp connecting industry leaders with technology partners, startups, and scale-ups.

Your role: given a company's innovation profile, generate highly relevant ecosystem matches and a tailored proposal.

RULES:
1. The ecosystem companies you generate should be realistic for The Beacon's Antwerp-based ecosystem: B2B tech startups and scale-ups in sectors like AI/data, cleantech, logistics tech, healthtech, smart manufacturing, fintech, and sustainability.
2. WHY explanations must be specific — reference the company's actual technology stack, strategic goals, or innovation gaps. Generic explanations are not acceptable.
3. For ProposalPoints: reference real Beacon offerings (Innovation Challenge, Explore/Engage/Strategic Partnership, Tech Tours, Co-Creation, Inspiration Sessions, Innovation Day). Explain WHY each offering matches THIS company's specific situation.
4. Events: generate 3 realistic upcoming events (within the next 4 months from today) that are genuinely relevant to the company's sector and challenges.
5. First 2 matches must be fully detailed (visible: true). Next 4 are teasers (visible: false) — just names and categories, whyMatch can be a teaser sentence.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  return block.text;
}

function extractJSON(text: string): unknown {
  // Strip markdown code fences if present
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = match ? match[1] : text;
  return JSON.parse(raw.trim());
}

// ─── Action handlers ─────────────────────────────────────────────────────────

async function analyzeCompany(companyName: string) {
  const userMessage = `Analyze the company: "${companyName}"

Return a JSON object with exactly this structure:
{
  "companyName": string,
  "companyType": "industrial" | "technology",
  "summary": string (2-3 sentences — what they do, their scale, their innovation posture),
  "dataConfidence": "high" | "medium" | "low",
  "overallScore": number (weighted average of dimension scores, 0-5),
  "dimensions": [
    {
      "key": "rd_investment",
      "label": "R&D & Technology Investment",
      "score": number,
      "description": string (1 concrete sentence based on evidence),
      "evidence": string (source: e.g. "Annual Report 2024 — €2.1B R&D spend")
    },
    {
      "key": "product_innovation",
      "label": "Product & Service Innovation",
      "score": number,
      "description": string,
      "evidence": string
    },
    {
      "key": "digital_transformation",
      "label": "Digital Transformation",
      "score": number,
      "description": string,
      "evidence": string
    },
    {
      "key": "partnerships_ecosystem",
      "label": "External Partnerships & Ecosystem",
      "score": number,
      "description": string,
      "evidence": string
    },
    {
      "key": "market_vision",
      "label": "Market Leadership & Vision",
      "score": number,
      "description": string,
      "evidence": string
    }
  ],
  "technologyStack": string[] (6-12 technologies with evidence from job postings etc.),
  "strategicGoals": [
    {
      "title": string,
      "description": string (what they've publicly committed to),
      "source": string (document/article where this was stated)
    }
  ],
  "strategicGoalsNote": string | null (null if goals found; message if not publicly verifiable),
  "activeProjects": [
    {
      "name": string,
      "description": string,
      "status": "announced" | "ongoing" | "pilot"
    }
  ],
  "innovationGaps": string[] (2-4 specific gaps or opportunities based on their profile),
  "beaconMatchRationale": string (2-3 sentences: why The Beacon ecosystem is the right partner for THIS company specifically)
}

Use dimension weights: R&D=25%, Product=25%, Digital=20%, Partnerships=15%, Vision=15% for the overall score.`;

  const raw = await callClaude(ANALYST_SYSTEM_PROMPT, userMessage);
  return extractJSON(raw);
}

async function generateMatches(companyProfile: unknown) {
  const today = new Date().toISOString().split("T")[0];
  const userMessage = `Today's date: ${today}

Company profile:
${JSON.stringify(companyProfile, null, 2)}

Generate ecosystem matches and a tailored proposal. Return a JSON object with exactly this structure:

{
  "matches": [
    {
      "id": string (unique),
      "name": string (realistic Belgian/European B2B tech company name),
      "category": string (e.g. "AI & Data", "Cleantech", "Logistics Tech", "Smart Manufacturing", "HealthTech", "Fintech", "Sustainability"),
      "description": string (1 sentence — what this company does),
      "whyMatch": string (2 sentences — specifically why they match based on the industry player's tech stack, goals, or gaps),
      "matchScore": number (60-98, based on relevance),
      "visible": true
    },
    {
      same structure, second detailed match, visible: true
    },
    {
      "id": string,
      "name": string,
      "category": string,
      "description": string (1 sentence),
      "whyMatch": string (teaser: "Unlock to discover why this partner could accelerate your [specific theme]"),
      "matchScore": number,
      "visible": false
    },
    ... 3 more with visible: false
  ],
  "proposalPoints": [
    {
      "offeringId": string (e.g. "innovation-challenge", "explore-partnership", "tech-tours"),
      "offeringName": string,
      "whyRelevant": string (2-3 sentences tailored to THIS company's specific situation, goals, and gaps — no generic descriptions)
    }
  ],
  "events": [
    {
      "id": string,
      "title": string (realistic event name relevant to the sector),
      "date": string (ISO date, within next 4 months from today),
      "time": "14:00",
      "location": "The Beacon, Antwerp",
      "description": string (2 sentences about the event),
      "relevance": string (1 sentence on why this specific company should attend),
      "category": string
    }
  ]
}

Generate exactly 6 matches (2 visible, 4 locked), 3-4 proposalPoints, and 3 events.`;

  const raw = await callClaude(MATCHMAKER_SYSTEM_PROMPT, userMessage);
  return extractJSON(raw);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, ...payload } = body;

    let result: unknown;

    switch (action) {
      case "analyze_company":
        result = await analyzeCompany(payload.companyName);
        break;

      case "generate_matches":
        result = await generateMatches(payload.companyProfile);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[analyze]", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
