import React, { useState } from "react";
import InputField from "./common/InputField";
import axios from "axios";

const PromisorryApproval = ({ transactionId, onSubmitSuccess }) => {
  console.log(transactionId);
  const [isApproved, setIsApproved] = useState(null);
  const [remarks, setRemarks] = useState("");

  const handleReject = () => {
    setIsApproved(false);
  };
  const handleApprove = () => {
    setIsApproved(true);
    setRemarks("APPROVED");
  };
  const handleButtonSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.put(
        `http://localhost:6100/transactions/promisoryApproval/${transactionId}`,
        { isApproved: isApproved, remarks: remarks },
        { headers }
      );
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <div className={isApproved === null ? `block` : `hidden`}>
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-300"
          >
            REJECT
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-600"
          >
            APPROVE
          </button>
        </div>
      </div>
      <div className={isApproved === null ? `hidden` : `block`}>
        <div className={isApproved !== false ? `hidden` : `block`}>
          <InputField
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>
      <div className={isApproved === null ? `hidden` : `block`}>
        <button
          onClick={handleButtonSubmit}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PromisorryApproval;
