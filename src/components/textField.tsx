import React from 'react';

type Params = {
    labelText: string;
    htmlForText: string;
    idText: string;
    placeholderText: string;
    onChangeFunction: (value: string | number | Date | boolean) => void;
};

const TextField: React.FC<Params> = ({ labelText, htmlForText, idText, placeholderText, onChangeFunction }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2 font-montserrat" htmlFor={htmlForText}>
        {labelText}
      </label>
      <input
        className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#F2F5FA] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline font-montserrat"
        id={idText}
        type="text"
        placeholder={placeholderText}
        onChange={(e) => onChangeFunction(e.target.value)}
        required
      />
    </div>
  );
};

export default TextField;