import React from "react";

const Test = () => {
  const handleCrash = () => {
    const user = undefined;
    console.log(user.name);
  };

  return <button onClick={handleCrash}>Crash Test</button>;
};

export default Test;
