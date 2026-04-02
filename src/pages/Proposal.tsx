import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Lock, ExternalLink, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { callAnalyze } from "@/lib/supabase";
import { track, saveReport } from "@/lib/tracking";
import { formatDate } from "@/lib/utils";
import type { CompanyAnalysis, MatchesResult } from "@/types/analysis";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-beacon-muted/50 ${className}`} />;
}

// ── Match Card ────────────────────────────────────────────────────────────────

function MatchCard({
  match,
  onUnlock,
}: {
  match: MatchesResult["matches"][0];
  onUnlock: () => void;
}) {
  const categoryColors: Record<string, string> = {
    "AI & Data":          BRAND.colors.blue,
    "Cleantech":          "#22C55E",
    "Logistics Tech":     BRAND.colors.amber,
    "Smart Manufacturing": BRAND.colors.orange,
    "HealthTech":         "#A78BFA",
    "Fintech":            "#34D399",
    "Sustainability":     "#4ADE80",
  };
  const catColor = categoryColors[match.category] ?? BRAND.colors.blue;

  if (!match.visible) {
    return (
      <div className="relative rounded-xl border border-beacon-border bg-beacon-card overflow-hidden">
        <div className="match-blurred p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-beacon-muted" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-beacon-muted text-beacon-ivory/50">
              {match.category}
            </span>
          </div>
          <p className="text-beacon-ivory font-semibold">{match.name}</p>
          <p className="text-beacon-ivory/50 text-sm">{match.description}</p>
          <p className="text-beacon-ivory/40 text-xs">{match.whyMatch}</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-beacon-dark/60 backdrop-blur-sm">
          <Lock size={20} className="text-beacon-ivory/50" />
          <p className="text-beacon-ivory/70 text-xs text-center px-4">
            Book a meeting to unlock
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-xl border bg-beacon-card space-y-3 transition-all hover:border-opacity-60"
      style={{ borderColor: catColor + "40" }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: catColor + "20", color: catColor }}
        >
          {match.name.charAt(0)}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: catColor + "15", color: catColor }}
          >
            {match.category}
          </span>
          <span className="text-beacon-ivory/40 text-xs">
            {match.matchScore}% match
          </span>
        </div>
      </div>
      <p className="text-beacon-ivory font-semibold text-sm">{match.name}</p>
      <p className="text-beacon-ivory/50 text-xs leading-relaxed">{match.description}</p>
      <div
        className="p-3 rounded-lg text-xs leading-relaxed"
        style={{ background: catColor + "10", color: catColor }}
      >
        <span className="font-medium">Why this match: </span>
        {match.whyMatch}
      </div>
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: MatchesResult["events"][0] }) {
  return (
    <div className="p-5 rounded-xl border border-beacon-border bg-beacon-card space-y-3 hover:border-beacon-blue/40 transition-all">
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-beacon-blue" />
        <span className="text-beacon-blue text-xs font-medium">
          {formatDate(event.date)}
        </span>
        <span className="text-beacon-ivory/30 text-xs">·</span>
        <Clock size={12} className="text-beacon-ivory/30" />
        <span className="text-beacon-ivory/30 text-xs">{event.time}</span>
      </div>
      <p className="text-beacon-ivory font-semibold text-sm">{event.title}</p>
      <p className="text-beacon-ivory/50 text-xs leading-relaxed">{event.description}</p>
      <div className="flex items-start gap-2 pt-1">
        <MapPin size={12} className="text-beacon-ivory/30 mt-0.5 shrink-0" />
        <p className="text-beacon-ivory/30 text-xs">{event.location}</p>
      </div>
      <div
        className="text-xs leading-relaxed p-2.5 rounded-lg"
        style={{ background: BRAND.colors.amber + "10", color: BRAND.colors.amber }}
      >
        {event.relevance}
      </div>
      <button
        onClick={() => track("event_register_click", { event_id: event.id, event_title: event.title })}
        className="w-full py-2 rounded-lg text-xs font-medium border border-beacon-border text-beacon-ivory/60 hover:text-beacon-ivory hover:border-beacon-blue/50 transition-all"
      >
        Reserve your spot →
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Proposal() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const companyName: string          = location.state?.companyName ?? "";
  const analysis: CompanyAnalysis    = location.state?.analysis;

  const [matches, setMatches]   = useState<MatchesResult | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!companyName || !analysis) { navigate("/"); return; }
    track("page_view", { page: "proposal" });
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      const data = await callAnalyze<MatchesResult>("generate_matches", {
        companyProfile: analysis,
      });
      setMatches(data);
      await saveReport(companyName, analysis, data);
      track("matches_generated", { count: data.matches.length });
    } catch (err) {
      toast.error("Could not load ecosystem matches.");
    } finally {
      setLoading(false);
    }
  }

  function handleBookMeeting() {
    track("cta_click", { cta: "book_meeting" });
    window.open(BRAND.calendly, "_blank");
  }

  const visibleMatches  = matches?.matches.filter((m) => m.visible)  ?? [];
  const lockedMatches   = matches?.matches.filter((m) => !m.visible) ?? [];

  return (
    <div className="min-h-screen bg-beacon-dark">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-beacon-border sticky top-0 z-10 bg-beacon-dark/95 backdrop-blur-sm">
        <button
          onClick={() => navigate("/report", { state: { companyName } })}
          className="flex items-center gap-2 text-beacon-ivory/60 hover:text-beacon-ivory transition-colors text-sm"
        >
          <span className="text-beacon-orange text-xl">◈</span>
          <span className="font-semibold tracking-wide">{BRAND.name}</span>
        </button>
        <span className="text-beacon-ivory/40 text-sm hidden sm:block">{companyName}</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="animate-fade-in text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-beacon-ivory">
            What we can{" "}
            <span style={{ color: BRAND.colors.orange }}>do together</span>
          </h1>
          <p className="text-beacon-ivory/60 max-w-xl mx-auto text-base leading-relaxed">
            Based on {companyName}'s innovation profile, here's how The Beacon ecosystem
            creates concrete value — matched to your specific technology stack, strategic priorities,
            and innovation gaps.
          </p>
        </div>

        {/* Proposal Points */}
        <section className="space-y-5">
          <h2 className="text-beacon-ivory font-semibold text-xl">
            Tailored Offerings
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <SkeletonBlock key={i} className="h-28" />)}
            </div>
          ) : matches?.proposalPoints.map((point, i) => {
            const service = [
              ...BRAND.memberships,
              ...BRAND.services,
            ].find((s) => s.id === point.offeringId);
            const icon = (service as any)?.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl border border-beacon-border bg-beacon-card hover:border-beacon-orange/30 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
              >
                <div className="flex items-start gap-4">
                  {icon && (
                    <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                  )}
                  <div className="space-y-1 flex-1">
                    <p className="text-beacon-ivory font-semibold text-sm">
                      {point.offeringName}
                    </p>
                    <p className="text-beacon-ivory/60 text-sm leading-relaxed">
                      {point.whyRelevant}
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="text-beacon-ivory/20 shrink-0 mt-0.5" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Free Connection Opportunity */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-beacon-ivory font-semibold text-xl">
                1 Free Connection Opportunity
              </h2>
              <p className="text-beacon-ivory/40 text-sm mt-1">
                Your best ecosystem matches — 2 revealed, 4 unlocked at your discovery meeting.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4,5,6].map(i => <SkeletonBlock key={i} className="h-48" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleMatches.map((m) => (
                <MatchCard key={m.id} match={m} onUnlock={handleBookMeeting} />
              ))}
              {lockedMatches.map((m) => (
                <MatchCard key={m.id} match={m} onUnlock={handleBookMeeting} />
              ))}
            </div>
          )}

          {!loading && (
            <div className="text-center pt-2">
              <p className="text-beacon-ivory/40 text-xs">
                Book a discovery call to unlock all 6 matches + receive full company profiles
              </p>
            </div>
          )}
        </section>

        {/* Our Space */}
        <section className="space-y-5">
          <h2 className="text-beacon-ivory font-semibold text-xl">
            Where innovation happens
          </h2>
          <p className="text-beacon-ivory/50 text-sm">
            The Beacon is more than a network — it's a physical space designed for collaboration,
            co-creation, and connection in the heart of Antwerp.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {BRAND.spaceImages.map((img) => (
              <div key={img.url} className="relative group overflow-hidden rounded-xl">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-beacon-dark/80 to-transparent" />
                <p className="absolute bottom-3 left-3 text-beacon-ivory/90 text-xs font-medium">
                  {img.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="space-y-5">
          <h2 className="text-beacon-ivory font-semibold text-xl">Upcoming Events</h2>
          <p className="text-beacon-ivory/50 text-sm">
            Events curated for {companyName}'s sector and innovation priorities.
          </p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1,2,3].map(i => <SkeletonBlock key={i} className="h-56" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {matches?.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section
          className="p-8 rounded-2xl text-center space-y-4"
          style={{
            background: `linear-gradient(135deg, ${BRAND.colors.orange}20, ${BRAND.colors.blue}15)`,
            border: `1px solid ${BRAND.colors.orange}30`,
          }}
        >
          <span className="text-4xl">◈</span>
          <h2 className="text-beacon-ivory font-bold text-2xl">
            Ready to connect?
          </h2>
          <p className="text-beacon-ivory/60 max-w-sm mx-auto text-sm leading-relaxed">
            A 30-minute discovery call is all it takes. We'll walk through your full
            ecosystem matches and design a tailored innovation roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleBookMeeting}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: BRAND.colors.orange, color: BRAND.colors.ivory }}
            >
              Book a discovery call
              <ExternalLink size={14} />
            </button>
            <button
              onClick={() => { track("cta_click", { cta: "email" }); window.location.href = `mailto:${BRAND.email}`; }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm border border-beacon-border text-beacon-ivory/70 hover:text-beacon-ivory hover:border-beacon-ivory/30 transition-all"
            >
              Send us an email
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-beacon-border mt-12 py-8 text-center text-beacon-ivory/25 text-xs space-y-1">
        <p className="text-beacon-orange/70 font-medium text-sm">◈ {BRAND.name}</p>
        <p>{BRAND.address}</p>
        <p>{BRAND.website}</p>
      </footer>
    </div>
  );
}
