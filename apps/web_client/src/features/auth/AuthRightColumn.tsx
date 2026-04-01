import React from 'react';

const AuthRightColumn: React.FC = () => {
  return (
<div className="hidden md:flex md:w-1/2 min-h-screen bg-gradient-to-b from-[#2b265f] to-[#241f4d] text-white px-16">
      <div className="flex flex-col w-full h-full py-14">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-6 rounded-lg bg-white/10 flex items-center justify-center">
            {/* placeholder icon */}
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M3 17l6-6 4 4 8-8" />
            </svg>
          </div>
          <span className="text-lg font-medium">Some company logo</span>
        </div>

        {/* Hero text */}
        <div className="mb-10 max-w-[420px]">
          <h2 className="text-5xl font-semibold leading-[1.1] mb-4">
            The Most <br />
            <span className="text-white/60">Transparent</span> <br />
            Exchange
          </h2>

          <p className="text-white/70 text-base leading-relaxed">
            Trade with confidence. Every transaction, every fee, every decision –
            completely transparent.
          </p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-4 mb-6 max-w-[460px]">
          {[
            {
              title: 'Something',
              desc: 'View market data',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
                </svg>
              ),
            },
            {
              title: 'Security protected',
              desc: 'Your assets protected with two-factor',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
                </svg>
              ),
            },
            {
              title: 'Advanced Analytics',
              desc: 'Professional tools for informed trading decisions',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 19h16" />
                  <path d="M6 17V9" />
                  <path d="M12 17V5" />
                  <path d="M18 17v-7" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl bg-white/10 px-6 py-5"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-6">
          <div>
            <p className="text-xl font-semibold">$2.4B+</p>
            <p className="text-sm text-white/60">Daily Volume</p>
          </div>
          <div>
            <p className="text-xl font-semibold">500K+</p>
            <p className="text-sm text-white/60">Active Traders</p>
          </div>
          <div>
            <p className="text-xl font-semibold">99.9%</p>
            <p className="text-sm text-white/60">Uptime</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthRightColumn;
