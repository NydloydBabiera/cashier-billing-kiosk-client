import React, { useState } from "react";

const ScanRFID = ({data}) => {
  const [rfidData, setRfidData] = useState("");

  const handleInputChange = (e) => {
    setRfidData(e.target.value);
  };
  return (
    <div className="w-full">
      <input
        type="text"
        value={rfidData}
        onChange={handleInputChange}
        placeholder="Scan RFID to search or add user"
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default ScanRFID;
