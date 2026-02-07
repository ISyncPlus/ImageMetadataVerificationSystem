type DashboardHeaderProps = {
  stats: {
    total: number;
    verified: number;
    suspicious: number;
    reused: number;
  };
};

export default function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-cyan-300/70">
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
        Control Centre Dashboard
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Image Metadata Verification System
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-white/5 to-transparent p-6 backdrop-blur md:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                Control Pulse
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.total}</p>
              <p className="mt-2 text-xs text-white/60">
                Total verification runs in archive
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-xs text-cyan-200">
              LIVE
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400"
              style={{ width: stats.total ? "82%" : "12%" }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-white/5 p-5 backdrop-blur md:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Verified
            </p>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-emerald-300">
            {stats.verified}
          </p>
          <p className="mt-2 text-[11px] text-white/50">Clean metadata signals</p>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-white/5 p-5 backdrop-blur md:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Flagged
            </p>
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-amber-300">
            {stats.suspicious}
          </p>
          <p className="mt-2 text-[11px] text-white/50">Missing time or GPS</p>
        </div>

        <div className="rounded-3xl border border-rose-400/20 bg-white/5 p-5 backdrop-blur md:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Reused
            </p>
            <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-rose-300">
            {stats.reused}
          </p>
          <p className="mt-2 text-[11px] text-white/50">Duplicate hash hits</p>
        </div>
      </div>
    </header>
  );
}
