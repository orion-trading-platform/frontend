import React from 'react';

// This page is where users initally land at 'oriontrading.pro'.
// This will look like a restricted mirror of dashboard, where non-authenticated users can explore and perform some actions, like view the top stocks table, general S&P trendlines, even search and click on individual stocks.
// These features (e.g. fetching stocks in search table) should have rate limiting and other bot protections built-in.
// However, performing auth required actions like clicking Order on a stock would redirect to the Login page. Of course, there's also a dedicated Login button.
// In turn, logout would redirect here (page="/"). The logout already does this but atm "/" temporarily directs to Login (see App.tsx).
const LandingPage: React.FC = () => {
  return (
    <div></div>
  );
};

export default LandingPage;
