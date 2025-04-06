import React, { useState, useRef, useEffect } from 'react';
import { COLOR_SCHEMES } from '../../models/AppSettings';
import './UI.css';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  className?: string;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = COLOR_SCHEMES,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Make sure it's a valid hex value before calling onChange
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  };
  
  const handlePresetSelect = (color: string) => {
    setInputValue(color);
    onChange(color);
    setIsOpen(false);
  };
  
  return (
    <div
      className={`color-picker ${className} ${disabled ? 'color-picker-disabled' : ''}`}
      ref={pickerRef}
    >
      {label && <div className="color-picker-label">{label}</div>}
      
      <div className="color-picker-container">
        <div
          className="color-picker-swatch"
          style={{ backgroundColor: inputValue }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        
        <input
          type="text"
          className="color-picker-input"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      
      {isOpen && (
        <div className="color-picker-presets">
          {presetColors.map((color, index) => (
            <div
              key={index}
              className="color-picker-preset"
              style={{ backgroundColor: color }}
              onClick={() => handlePresetSelect(color)}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;