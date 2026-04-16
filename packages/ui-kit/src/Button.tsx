import React from 'react';

type ButtonVariant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:     'bg-[var(--accent)] hover:bg-[#4e5cbd] active:bg-[#434fb3] text-white',
  danger:      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
  ghost:       'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-[#2d2f50] dark:text-[#a0aec0] dark:hover:bg-[#1f2240]',
};

const Button: React.FC<ButtonProps> = ({ variant = 'ghost', className = '', children, ...props }) => (
  <button
    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variantClass[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
