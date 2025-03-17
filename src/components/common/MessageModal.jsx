import React from "react";
import { GiConfirmed } from "react-icons/gi";
import { IoIosWarning } from "react-icons/io";
import { IoInformationCircleSharp } from "react-icons/io5";

const MessageModal = ({ isOpen, onClose, messsage, type, onConfirm }) => {
  if (!isOpen) return null;
  const iconDisplay = (msgType) => {
    switch (msgType) {
      case "Confirmation":
        return <GiConfirmed className="color-blue-500" />;
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

        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{iconDisplay(type)}</div>
          <h2 className="text-2xl font-semibold">{type}</h2>
        </div>

        <div>
          <p className="text-2xl">{messsage}</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
