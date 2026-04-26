import { ReactNode } from 'react';

interface LandingDashboardGridProps {
  header: ReactNode;
  heroText: ReactNode;
  marketingPanel: ReactNode;
  movers: ReactNode;
  holdings: ReactNode;
}

export const LandingDashboardGrid = ({
  header,
  heroText,
  marketingPanel,
  movers,
  holdings,
}: LandingDashboardGridProps) => {
  return (
    <div className="flex flex-col h-screen [@media(max-height:940px)]:h-auto [@media(max-height:940px)]:min-h-screen font-['Noto_Sans',Roboto,sans-serif] bg-[#F8FAFC] dark:bg-[#0D0D14]">

      {/* HEADER */}
      {header}

      {/* MOVERS STRIP */}
      <div className="movers-strip lg:hidden shrink-0 w-full pt-4 pb-2">
        {movers}
      </div>

      {/* BODY */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden [@media(max-height:940px)]:flex-none [@media(max-height:940px)]:overflow-visible max-w-[84rem] mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* LEFT COL */}
        <div className="flex-[4] flex flex-col min-w-0 overflow-hidden [@media(max-height:940px)]:overflow-visible pl-0 lg:pl-5 pr-0 lg:pr-2.5 pt-4 lg:pt-8 pb-7 gap-5">
          <div className="flex-1 min-h-0 overflow-hidden [@media(max-height:940px)]:flex-none [@media(max-height:940px)]:overflow-visible flex flex-col sm:flex-row gap-5">
            <div className="flex-1 min-w-0 overflow-hidden [@media(max-height:940px)]:overflow-visible pb-10">{heroText}</div>
            <div className="flex-1 min-w-0 overflow-hidden [@media(max-height:940px)]:h-[360px] flex flex-col">{holdings}</div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden [@media(max-height:940px)]:flex-none [@media(max-height:940px)]:h-[280px]">{marketingPanel}</div>
        </div>

        {/* RIGHT COL */}
        <div className="hidden lg:block flex-[1] min-w-0 overflow-hidden h-full [@media(max-height:940px)]:h-auto pl-2.5 pr-0 pt-5 pb-5">
          {movers}
        </div>

      </main>
    </div>
  );
};
