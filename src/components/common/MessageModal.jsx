import React from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
import { IoInformationCircleSharp } from "react-icons/io5";

const MessageModal = ({ isOpen, onClose, messsage, type }) => {
  if (!isOpen) return null;
  const iconDisplay = (msgType) => {
    switch (msgType) {
      case "Confirmation":
        return <GiConfirmed className="color-blue-500"/>;
      case "Information":
        return <IoInformationCircleSharp />;
      case "Warning":
        return <IoIosWarning />;
      default:
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">{type} {iconDisplay(type)}</h2>
        <div>{messsage}</div>
      </div>
    </div>
  );
};

export default MessageModal;
