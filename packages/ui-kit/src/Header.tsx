import React from 'react';

interface HeaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ left, right }) => (
  <header
    className="flex-shrink-0 flex items-center justify-between px-6 py-4"
    style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)' }}
  >
    {left}
    {right}
  </header>
);

export default Header;
