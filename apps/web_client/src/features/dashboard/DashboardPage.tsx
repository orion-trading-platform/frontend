import { DashboardGrid } from './layouts/DashboardGrid';
import { StatCard } from './components/StatCard';
import { RecentActivity } from './components/RecentActivity';
import { MOCK_STATS, MOCK_ACTIVITY } from './data/mockData';
import { PerformanceChart } from './components/PerformanceChart';

export const DashboardPage = () => {
  return (
    <DashboardGrid
      header={<h1>My Dashboard</h1>}
      stats={
        <>
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </>
      }
      chart={<PerformanceChart />}
      activity={
        <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
          <h3>Sidebar Placeholder</h3>
          <p>Recent Activity will go here.</p>
        </div>
      }
      holdings={<div>Holdings Placeholder</div>}
    />
  );
};


export default DashboardPage;