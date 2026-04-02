import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Zap, Target, Users } from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/lib/brand";
import { startSession } from "@/lib/tracking";
import { track } from "@/lib/tracking";

export default function Landing() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = company.trim();
    if (!name) return;
    setLoading(true);
    try {
      await startSession(name);
      track("analysis_started", { company_name: name });
      navigate("/report", { state: { companyName: name } });
    } catch {
      toast.error("Could not start session. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-beacon-dark flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-beacon-border">
        <div className="flex items-center gap-2">
          <span className="text-beacon-orange text-2xl">◈</span>
          <span className="text-beacon-ivory font-semibold tracking-wide text-lg">
            {BRAND.name}
          </span>
        </div>
        <span className="text-beacon-ivory/40 text-sm hidden sm:block">
          Innovation Maturity Platform
        </span>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00ACD9 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-beacon-orange/40 bg-beacon-orange/10">
            <Zap size={13} className="text-beacon-orange" />
            <span className="text-beacon-orange text-xs font-medium tracking-wider uppercase">
              AI-Powered Innovation Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-beacon-ivory leading-tight">
            Your company's{" "}
            <span style={{ color: BRAND.colors.orange }}>innovation DNA</span>
            <br />in minutes.
          </h1>

          <p className="text-beacon-ivory/60 text-lg max-w-xl mx-auto leading-relaxed">
            Enter a company name. Our AI analyses public data to produce a full
            innovation maturity report — and shows exactly how{" "}
            <span style={{ color: BRAND.colors.amber }}>The Beacon ecosystem</span>{" "}
            can accelerate your growth.
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-beacon-ivory/30"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Umicore, Bekaert, Telenet…"
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-beacon-card border border-beacon-border text-beacon-ivory placeholder:text-beacon-ivory/30 focus:outline-none focus:border-beacon-blue transition-colors text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !company.trim()}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: BRAND.colors.orange, color: BRAND.colors.ivory }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting…
                  </span>
                ) : (
                  <>
                    Analyse
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            <p className="text-beacon-ivory/30 text-xs mt-3">
              No forms. No sign-up. Just a company name.
            </p>
          </form>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            {
              icon: <Zap size={16} className="text-beacon-orange" />,
              title: "Innovation Maturity Score",
              desc: "5-dimension assessment powered by public data",
            },
            {
              icon: <Target size={16} className="text-beacon-blue" />,
              title: "Ecosystem Matchmaking",
              desc: "Matched to Beacon members, services & programs",
            },
            {
              icon: <Users size={16} style={{ color: BRAND.colors.amber }} />,
              title: "Concrete Proposal",
              desc: "Why The Beacon — tailored to your company's gaps",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-2 p-4 rounded-xl border border-beacon-border bg-beacon-card/60"
            >
              <div className="flex items-center gap-2">
                {f.icon}
                <span className="text-beacon-ivory text-sm font-medium">{f.title}</span>
              </div>
              <p className="text-beacon-ivory/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-beacon-ivory/25 text-xs border-t border-beacon-border">
        {BRAND.address} · {BRAND.website}
      </footer>
    </div>
  );
}
