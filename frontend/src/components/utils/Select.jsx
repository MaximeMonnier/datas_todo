import React from "react";

const Select = ({
  options = [],
  value,
  onChange,
  size = "md",
  placeholder = "Choisir...",
  className = "",
}) => {
  // Gestion des tailles cohérentes avec tes autres composants
  const sizes = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${sizes[size]} ${className}`}
    >
      {(!value || value === "") && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {/* Liste déroulante - supporte string ou {value, label} */}
      {options.map((opt, index) => {
        const optValue = typeof opt === "object" ? opt.value : opt;
        const optLabel = typeof opt === "object" ? opt.label : opt;
        return (
          <option key={index} value={optValue}>
            {optLabel}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
