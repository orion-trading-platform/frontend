import React from 'react';
import LoginLeftColumn from './LoginLeftColumn';
import LoginRightColumn from './LoginRightColumn';

const Login: React.FC = () => {
  return (
    <div className="flex flex-row min-h-screen bg-[#0a0a14]">
      <LoginLeftColumn />
      <LoginRightColumn />
    </div>
  );
};

export default Login;
