import React from 'react';
import { Field } from './Field';

interface Props {
  label: string;
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  suffix?: string;
  step?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  helperText?: string;
}

export const NumberField: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  suffix, 
  step, 
  className, 
  inputClassName = '',
  placeholder,
  helperText
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(undefined);
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <Field label={label} suffix={suffix} className={className} helperText={helperText}>
      <input 
        type="number" 
        step={step}
        value={value === undefined ? '' : value}
        onChange={handleChange}
        className={`input-field pr-12 ${inputClassName}`}
        placeholder={placeholder}
      />
    </Field>
  );
};
