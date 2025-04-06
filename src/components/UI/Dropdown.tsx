import React, { useState, useRef, useEffect } from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import './UI.css';

interface DropdownProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { settings } = useAppSettings();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update selected value when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);
  
  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    
    if (onChange) {
      onChange(optionValue);
    }
  };
  
  const selectedLabel = options.find(option => option.value === selectedValue)?.label || '';
  
  const style = {
    '--color-scheme': settings.colorScheme
  } as React.CSSProperties;
  
  return (
    <div
      className={`dropdown ${className} ${disabled ? 'dropdown-disabled' : ''}`}
      ref={dropdownRef}
      style={style}
    >
      {label && <div className="dropdown-label">{label}</div>}
      
      <div
        className={`dropdown-header ${isOpen ? 'dropdown-header-open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="dropdown-selected">{selectedLabel}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="dropdown-options">
          {options.map(option => (
            <div
              key={option.value}
              className={`dropdown-option ${option.value === selectedValue ? 'dropdown-option-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;