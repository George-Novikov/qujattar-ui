import React, { useState, useEffect, useRef } from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import './UI.css';

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  valueSuffix?: string;
  className?: string;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  valueSuffix = '',
  className = '',
  disabled = false
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { settings } = useAppSettings();
  
  // Update current value when value prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };
  
  const calculateFillPercentage = () => {
    return ((currentValue - min) / (max - min)) * 100;
  };
  
  const style = {
    '--fill-percentage': `${calculateFillPercentage()}%`,
    '--color-scheme': settings.colorScheme
  } as React.CSSProperties;
  
  return (
    <div
      className={`slider ${className} ${disabled ? 'slider-disabled' : ''}`}
      ref={sliderRef}
    >
      {label && (
        <div className="slider-header">
          <div className="slider-label">{label}</div>
          {showValue && (
            <div className="slider-value">
              {currentValue}
              {valueSuffix}
            </div>
          )}
        </div>
      )}
      
      <div className="slider-container" style={style}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="slider-input"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Slider;