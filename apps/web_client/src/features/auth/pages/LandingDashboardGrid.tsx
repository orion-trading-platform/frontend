import { ReactNode } from 'react';

interface LandingDashboardGridProps {
  header: ReactNode;
  movers: ReactNode;
  holdings: ReactNode;
  assetTop?: ReactNode;
  assetBottom?: ReactNode;
}

export const LandingDashboardGrid = ({
  header,
  movers,
  holdings,
  assetTop,
  assetBottom,
}: LandingDashboardGridProps) => {
  return (
    <div className="flex flex-col h-screen font-['Noto_Sans',Roboto,sans-serif] bg-[#F8FAFC] dark:bg-[#0D0D14]">

      {/* HEADER */}
      {header}

      {/* BODY */}
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* LEFT COL - INFO */}
        <div className="flex flex-col flex-1 overflow-hidden bg-[#F8FAFC] dark:bg-[#0D0D14] gap-5 pl-5 pb-5 pt-5 pr-2.5">
          <div>{movers}</div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">{holdings}</div>
        </div>

        {/* RIGHT COL - MARKETING */}
        <aside
          aria-label="Orion trading platform marketing"
          className="hidden min-[1152px]:flex flex-col w-1/2 flex-shrink-0 overflow-hidden"
        >
          {/* TOP ASSET */}
          <div className="flex-1 min-h-0 max-h-[calc(50vh-2.5rem)] overflow-hidden bg-[#F8FAFC] dark:bg-[#0D0D14] pl-2.5 pb-2.5 pt-5 pr-5">
            {assetTop}
          </div>

          {/* BOTTOM ASSET */}
          <div className="flex-1 min-h-0 max-h-[calc(50vh-2.5rem)] overflow-hidden bg-[#F8FAFC] dark:bg-[#0D0D14] pl-2.5 pt-2.5 pb-5 pr-5">
            {assetBottom}
          </div>
        </aside>

      </div>
    </div>
  );
};
