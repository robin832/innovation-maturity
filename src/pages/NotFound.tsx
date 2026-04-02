import { useNavigate } from "react-router-dom";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-beacon-dark flex flex-col items-center justify-center gap-6 text-center px-6">
      <span className="text-beacon-orange text-5xl">◈</span>
      <h1 className="text-beacon-ivory text-3xl font-bold">Page not found</h1>
      <p className="text-beacon-ivory/50 text-sm max-w-xs">
        This page doesn't exist. Let's get you back to the innovation intelligence platform.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-xl font-semibold text-sm"
        style={{ background: BRAND.colors.orange, color: BRAND.colors.ivory }}
      >
        Back to start
      </button>
    </div>
  );
}
