import React from "react";

const Button = ({
  color = "bg-blue-500",
  size = "md",
  onClick,
  disabled = false,
  children,
  className = "",
}) => {
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const baseClasses = `
    ${color}
    text-white rounded hover:opacity-90 transition duration-200
    ${sizes[size]}
    ${className}
  `;

  return (
    <button onClick={onClick} disabled={disabled} className={baseClasses}>
      {children}
    </button>
  );
};

export default Button;
