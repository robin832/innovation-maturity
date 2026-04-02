import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Info, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { callAnalyze } from "@/lib/supabase";
import { track, updateSession, saveReport } from "@/lib/tracking";
import { getMaturityLevel, confidenceBadge, scoreToPercent } from "@/lib/utils";
import type { CompanyAnalysis } from "@/types/analysis";

// ── Sub-components ────────────────────────────────────────────────────────────

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-beacon-muted/50 ${className}`} />
  );
}

function DimensionBar({ dim, index }: { dim: CompanyAnalysis["dimensions"][0]; index: number }) {
  const pct = scoreToPercent(dim.score);
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-beacon-ivory/80 text-sm font-medium">{dim.label}</span>
        <span className="text-beacon-ivory font-bold text-sm tabular-nums">
          {dim.score.toFixed(1)}
          <span className="text-beacon-ivory/30 font-normal">/5</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-beacon-muted overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full score-bar-fill transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-beacon-ivory/50 text-xs leading-relaxed">{dim.description}</p>
      <p className="text-beacon-ivory/30 text-xs mt-0.5 italic">{dim.evidence}</p>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const pct = scoreToPercent(score);
  const { label, color } = getMaturityLevel(score);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1A4A58" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ACD9" />
            <stop offset="100%" stopColor="#E36037" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: "-100px" }}>
        {/* Centered text inside ring */}
      </div>
      {/* Score display below ring */}
      <div className="text-center -mt-2">
        <div className="text-4xl font-bold text-beacon-ivory tabular-nums">
          {score.toFixed(1)}
        </div>
        <div className="text-beacon-ivory/40 text-xs">out of 5.0</div>
        <div
          className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ color, background: color + "20" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const companyName: string = location.state?.companyName ?? "";

  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!companyName) {
      navigate("/");
      return;
    }
    track("page_view", { page: "report" });
    loadAnalysis();
  }, [companyName]);

  async function loadAnalysis() {
    try {
      const data = await callAnalyze<CompanyAnalysis>("analyze_company", {
        companyName,
      });
      setAnalysis(data);
      await updateSession({
        company_type:    data.companyType,
        overall_score:   data.overallScore,
        data_confidence: data.dataConfidence,
      });
      await saveReport(data.companyName, data);
      track("analysis_complete", {
        company_type:  data.companyType,
        overall_score: data.overallScore,
        confidence:    data.dataConfidence,
      });
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function goToProposal() {
    track("cta_click", { cta: "view_proposal" });
    navigate("/proposal", { state: { companyName, analysis } });
  }

  const confidence = analysis ? confidenceBadge(analysis.dataConfidence) : null;

  return (
    <div className="min-h-screen bg-beacon-dark">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-beacon-border sticky top-0 z-10 bg-beacon-dark/95 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-beacon-ivory/60 hover:text-beacon-ivory transition-colors text-sm"
        >
          <span className="text-beacon-orange text-xl">◈</span>
          <span className="font-semibold tracking-wide">{BRAND.name}</span>
        </button>
        {analysis && (
          <div className="flex items-center gap-2">
            {confidence && (
              <span className={`text-xs px-2 py-1 rounded-full border ${confidence.className}`}>
                {confidence.label}
              </span>
            )}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="animate-fade-in">
          {loading ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-8 w-64" />
              <SkeletonBlock className="h-4 w-96" />
              <div className="mt-4 flex items-center gap-2 text-beacon-blue text-sm">
                <span className="w-4 h-4 border-2 border-beacon-blue/30 border-t-beacon-blue rounded-full animate-spin" />
                Analysing {companyName} from public data…
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-300 font-medium">Analysis failed</p>
                <p className="text-red-400/70 text-sm mt-1">{error}</p>
                <button
                  onClick={() => { setError(null); setLoading(true); loadAnalysis(); }}
                  className="text-red-300 text-sm underline mt-2"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : analysis && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider"
                  style={{
                    background: BRAND.colors.orange + "20",
                    color: BRAND.colors.orange,
                    border: `1px solid ${BRAND.colors.orange}40`,
                  }}
                >
                  {analysis.companyType === "industrial" ? "Industry Player" : "Technology Company"}
                </span>
                {confidence && (
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${confidence.className}`}>
                    {confidence.label}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-beacon-ivory">
                {analysis.companyName}
              </h1>
              <p className="text-beacon-ivory/60 text-base leading-relaxed max-w-2xl">
                {analysis.summary}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          // Skeleton
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonBlock className="h-64" />
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => <SkeletonBlock key={i} className="h-12" />)}
              </div>
            </div>
            <SkeletonBlock className="h-32" />
            <SkeletonBlock className="h-48" />
          </div>
        ) : analysis && (
          <>
            {/* Score + Dimensions */}
            <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 p-6 rounded-2xl border border-beacon-border bg-beacon-card">
              <div className="flex items-start justify-center pt-4">
                <ScoreRing score={analysis.overallScore} />
              </div>
              <div className="space-y-5">
                <h2 className="text-beacon-ivory font-semibold text-lg">
                  Innovation Maturity Breakdown
                </h2>
                {analysis.dimensions.map((dim, i) => (
                  <DimensionBar key={dim.key} dim={dim} index={i} />
                ))}
              </div>
            </section>

            {/* Technology Stack */}
            {analysis.technologyStack.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-beacon-ivory font-semibold text-lg flex items-center gap-2">
                  Technology Stack
                  <span className="text-beacon-ivory/30 text-xs font-normal">
                    · from job postings & public sources
                  </span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologyStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-sm border border-beacon-border bg-beacon-card text-beacon-ivory/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Strategic Goals */}
            <section className="space-y-4">
              <h2 className="text-beacon-ivory font-semibold text-lg">Strategic Goals</h2>
              {analysis.strategicGoals.length > 0 ? (
                <div className="space-y-3">
                  {analysis.strategicGoals.map((goal, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-beacon-border bg-beacon-card space-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-beacon-blue mt-0.5 shrink-0" />
                        <p className="text-beacon-ivory font-medium text-sm">{goal.title}</p>
                      </div>
                      <p className="text-beacon-ivory/60 text-sm pl-5">{goal.description}</p>
                      <p className="text-beacon-ivory/30 text-xs pl-5 italic">
                        Source: {goal.source}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-beacon-border bg-beacon-card/50 flex items-start gap-3">
                  <Info size={16} className="text-beacon-amber mt-0.5 shrink-0" />
                  <p className="text-beacon-ivory/50 text-sm leading-relaxed">
                    {analysis.strategicGoalsNote ??
                      "Strategic goals are not publicly disclosed. Our conversation will uncover them."}
                  </p>
                </div>
              )}
            </section>

            {/* Active Projects */}
            {analysis.activeProjects.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-beacon-ivory font-semibold text-lg">Active Innovation Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.activeProjects.map((proj, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-beacon-border bg-beacon-card"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-beacon-ivory font-medium text-sm">{proj.name}</p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: BRAND.colors.blue + "20",
                            color: BRAND.colors.blue,
                          }}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-beacon-ivory/50 text-xs leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Innovation Gaps */}
            {analysis.innovationGaps.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-beacon-ivory font-semibold text-lg">Innovation Gaps & Opportunities</h2>
                <div className="space-y-2">
                  {analysis.innovationGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-beacon-amber/20 bg-beacon-amber/5"
                    >
                      <span className="text-beacon-amber text-sm mt-0.5">→</span>
                      <p className="text-beacon-ivory/70 text-sm">{gap}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why The Beacon */}
            <section className="p-6 rounded-2xl border border-beacon-orange/30 bg-beacon-orange/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-beacon-orange text-xl">◈</span>
                <h2 className="text-beacon-ivory font-semibold text-lg">Why The Beacon</h2>
              </div>
              <p className="text-beacon-ivory/70 leading-relaxed text-sm">
                {analysis.beaconMatchRationale}
              </p>
            </section>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <button
                onClick={goToProposal}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:gap-4"
                style={{ background: BRAND.colors.orange, color: BRAND.colors.ivory }}
              >
                See what we can do together
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
