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
    <div className="flex flex-col h-screen font-['Noto_Sans',Roboto,sans-serif] bg-[#F8FAFC] dark:bg-[#0D0D14]">

      {/* HEADER */}
      {header}

      {/* BODY */}
      <main className="flex flex-row flex-1 overflow-hidden mx-[20%]">

        {/* LEFT COL */}
        <div className="flex-[4] flex flex-col min-w-0 overflow-hidden pl-5 pr-2.5 pt-5 pb-5 gap-5">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-row gap-5">
            <div className="flex-1 min-w-0 overflow-hidden">{heroText}</div>
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col">{holdings}</div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">{marketingPanel}</div>
        </div>

        {/* RIGHT COL */}
        <div className="flex-[1] min-w-0 overflow-hidden pl-2.5 pr-5 pt-5 pb-5">
          {movers}
        </div>

      </main>
    </div>
  );
};
