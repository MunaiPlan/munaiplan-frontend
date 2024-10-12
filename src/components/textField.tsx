import React, { Dispatch, SetStateAction } from 'react';
import { ChangeHandler } from 'react-hook-form';

interface InputStringProps {
  label: string;
  id: string;
  placeholder: string;
  value: string; 
  setValue: Dispatch<SetStateAction<string>>; 
  onChange: ChangeHandler;  // onChange handler from react-hook-form
  onBlur: ChangeHandler;    // onBlur handler from react-hook-form
  ref: React.Ref<HTMLInputElement>;
}

interface InputNumberProps {
  label: string;
  id: string;
  placeholder: string;
  value: number; 
  setValue: Dispatch<SetStateAction<number>>; 
  onChange: ChangeHandler;  // onChange handler from react-hook-form
  onBlur: ChangeHandler;    // onBlur handler from react-hook-form
  ref: React.Ref<HTMLInputElement>;
}

export const InputString: React.FC<InputStringProps> = ({ label, id, placeholder, value, setValue, onChange, onBlur, ref }) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
        }}
        onBlur={onBlur}
        ref={ref}
        required
        className="w-full p-2 border rounded"
      />
    </div>
  );
};


export const InputNumber: React.FC<InputNumberProps> = ({ label, id, placeholder, value, setValue, onChange, onBlur, ref }) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = +e.target.value;
          setValue(newValue);
        }}
        onBlur={onBlur}
        ref={ref}
        required
        className="w-full p-2 border rounded"
      />
    </div>
  );
};