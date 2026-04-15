import React from 'react';
import { ACCENT } from './constants';

interface HeaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ left, right }) => (
  <header
    className="flex-shrink-0 flex items-center justify-between"
    style={{ background: ACCENT, padding: '15px 25px' }}
  >
    {left}
    {right}
  </header>
);

export default Header;
