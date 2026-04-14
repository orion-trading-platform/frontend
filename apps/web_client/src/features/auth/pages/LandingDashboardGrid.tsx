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
    <div className="flex flex-col h-screen font-['Noto_Sans',Roboto,sans-serif]">

      {/* HEADER */}
      <header
        className="flex-shrink-0 flex items-center px-6 py-2 font-['IBM_Plex_Serif',serif]"
        style={{ background: 'rgb(94, 111, 161)' }}
      >
        {header}
      </header>

      {/* BODY */}
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* LEFT COL - INFO */}
        <div className="flex flex-col flex-1 overflow-hidden bg-[#F8FAFC] gap-5 p-5">
          <div>{movers}</div>
          <div className="flex-1 min-h-0 overflow-y-auto">{holdings}</div>
        </div>

        {/* RIGHT COL - MARKETING */}
        <aside
          aria-label="Platform highlights"
          className="hidden min-[1152px]:flex flex-col w-1/2 flex-shrink-0"
        >
          {/* Top asset panel */}
          <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-4">
            {assetTop ?? (
              <div className="w-full h-full flex items-center justify-center border border-[#BCCCDC] rounded-lg text-[#9AA6B2] text-sm select-none">
                Placeholder asset
              </div>
            )}
          </div>

          {/* Bottom asset panel */}
          <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-4">
            {assetBottom ?? (
              <div className="w-full h-full flex items-center justify-center border border-[#BCCCDC] rounded-lg text-[#9AA6B2] text-sm select-none">
                Placeholder asset
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};
