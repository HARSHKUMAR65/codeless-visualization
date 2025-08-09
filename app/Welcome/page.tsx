import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";

const Welcome = () => {
  return (
    <DashboardLayout>
      {/* Background glow + gradient accents */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-500 opacity-20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-28 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 opacity-20 blur-3xl animate-pulse [animation-delay:250ms]" />
          <div className="absolute top-1/3 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-sm blur-xl" />
        </div>

        {/* Hero */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-md dark:bg-white/10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
                  New Project
                </div>
                <h1 className="mt-3 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                  Welcome to <span className="whitespace-nowrap">Codeless Visualization</span>
                </h1>
                <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                  Build beautiful, interactive dashboards without writing a single line of code.
                  Connect data, drag-and-drop charts, and share insights instantly.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02] hover:shadow-md active:scale-[0.99]"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
                    Create New Dashboard
                  </a>
                  <a
                    href="#templates"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300/70 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Explore Templates
                  </a>
                </div>
              </div>

              {/* Minimal animated logo mark */}
              <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-white/70 shadow-inner backdrop-blur md:mx-0">
                <svg
                  className="h-16 w-16 animate-[spin_18s_linear_infinite]"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#a21caf" />
                    </linearGradient>
                  </defs>
                  <rect x="6" y="6" width="14" height="14" rx="3" stroke="url(#g)" strokeWidth="2.5" />
                  <rect x="28" y="10" width="14" height="10" rx="3" stroke="url(#g)" strokeWidth="2.5" />
                  <rect x="10" y="28" width="10" height="14" rx="3" stroke="url(#g)" strokeWidth="2.5" />
                  <path d="M20 13h8M14 28h20M32 20v8" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/20 blur-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Quick actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Connect a Data Source",
                desc: "Google Sheets, CSV, MySQL, Postgres, APIs.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                href: "#connect",
              },
              {
                title: "New Visualization",
                desc: "Bar, Line, Pie, KPI, Map, and more.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M4 19V5M10 19v-8M16 19v-4M22 19H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                href: "#new-viz",
              },
              {
                title: "Use a Template",
                desc: "Start fast with curated layouts.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <rect x="3" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
                    <rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                href: "#templates",
              },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 blur-2xl transition group-hover:scale-125" />
                <div className="mb-3 inline-flex items-center gap-2 text-slate-700">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:rotate-6">
                    {c.icon}
                  </span>
                  <span className="text-sm font-bold">{c.title}</span>
                </div>
                <p className="text-sm text-slate-600">{c.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Helpful tips */}
        <section className="mb-2">
          <h2 className="mb-3 text-lg font-bold text-slate-800">Tips to get started</h2>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              "Connect Google Sheets or upload a CSV to begin.",
              "Drag any chart onto the canvas, then drop a metric or dimension.",
              "Use filters and date ranges to refine your story.",
              "Invite teammates to collaborate and comment in real-time.",
            ].map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
              >
                <span className="mt-1 inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Welcome ;
