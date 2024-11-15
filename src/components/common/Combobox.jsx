import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Combobox = ({ label, id, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure options is an array before filtering
  const filteredOptions = Array.isArray(options)
    ? options.filter(option => option.toLowerCase().includes(value.toLowerCase()))
    : [];

  const handleInputChange = (e) => {
    onChange(e); // Pass the event to the parent
    setIsOpen(true); // Open the dropdown when user types
  };

  const handleOptionSelect = (option) => {
    // Manually create an event object to pass name and value
    onChange({ target: { name: id, value: option } });
    setIsOpen(false); // Close dropdown when an option is selected
  };

  return (
    <div className="relative mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)} // Open dropdown when input is focused
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Close dropdown with a delay for click events
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Combobox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Combobox.defaultProps = {
  placeholder: '',
};

export default Combobox;