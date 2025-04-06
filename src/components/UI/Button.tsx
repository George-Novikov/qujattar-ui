import React from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import './UI.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'text' | 'icon';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button'
}) => {
  const { settings } = useAppSettings();
  
  let sizeClass = '';
  switch (size) {
    case 'small':
      sizeClass = 'btn-small';
      break;
    case 'large':
      sizeClass = 'btn-large';
      break;
    default:
      sizeClass = 'btn-medium';
  }
  
  let variantClass = '';
  switch (variant) {
    case 'secondary':
      variantClass = 'btn-secondary';
      break;
    case 'text':
      variantClass = 'btn-text';
      break;
    case 'icon':
      variantClass = 'btn-icon';
      break;
    default:
      variantClass = 'btn-primary';
  }
  
  const style = {
    '--color-scheme': settings.colorScheme
  } as React.CSSProperties;
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${fullWidth ? 'btn-full-width' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;