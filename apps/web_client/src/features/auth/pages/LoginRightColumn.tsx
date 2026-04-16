import React from 'react';

const LoginRightColumn: React.FC = () => {
  return (
    <>
      <aside aria-label="Platform overview" className="hidden md:flex md:w-1/2 min-h-screen bg-[#0d0d14] relative overflow-hidden items-center">

        {/* GRID */}
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* VIGNETTE FADE */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(to right, #0d0d14 0%, transparent 12%, transparent 88%, #0d0d14 100%)',
              'linear-gradient(to bottom, #0d0d14 0%, transparent 10%, transparent 90%, #0d0d14 100%)',
            ].join(', '),
          }}
        />

        <div className="relative z-10 flex flex-col w-full px-16 py-16">

          {/* SERIF HERO TEXT */}
          <div className="mb-10 max-w-[440px]">
            <h2 className="font-display text-[3.25rem] font-bold leading-[1.05] mb-5 text-white tracking-tight">
              The Most<br />
              <span className="italic text-[#7C8FF5]">Transparent</span><br />
              Exchange
            </h2>
            <p className="font-sans text-white/70 text-[0.9rem] leading-relaxed max-w-[360px]">
              Every transaction, every fee, every decision — completely in the open.
              Trade with full confidence.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="flex flex-col gap-3 mb-10 max-w-[480px]">
            {[
              {
                title: 'Real-time market data',
                desc: 'Live order books and price feeds with sub-millisecond latency across all pairs.',
                icon: (
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 7v5l3 3" />
                  </svg>
                ),
              },
              {
                title: 'Security protected',
                desc: 'Two-factor authentication, cold storage, and real-time threat monitoring on all assets.',
                icon: (
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                ),
              },
              {
                title: 'Advanced analytics',
                desc: 'Professional charting tools, portfolio insights, and tax reporting built in.',
                icon: (
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M4 20h16M7 20V13M12 20V8M17 20v-5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-white/[0.07] flex items-center justify-center flex-shrink-0 text-white/60">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-white mb-0.5">{item.title}</p>
                  <p className="font-sans text-xs text-white/65 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className="inline-flex items-stretch rounded-xl bg-white/[0.04] border border-white/[0.07] max-w-fit overflow-hidden">
            {[
              { value: '$2.4B+', label: 'Daily Volume' },
              { value: '500K+', label: 'Active Traders' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px bg-white/10 flex-shrink-0" />}
                <div className="px-7 py-4">
                  <p className="font-sans text-lg font-bold text-white leading-none mb-1">{stat.value}</p>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/60">{stat.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </aside>
    </>
  );
};

export default LoginRightColumn;
