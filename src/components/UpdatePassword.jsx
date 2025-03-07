import React, { useState } from "react";
import InputField from "./common/InputField";
import MessageModal from "./common/MessageModal";
import axios from "axios";

const UpdatePassword = ({ onSubmit, onSubmitSuccess, id }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      console.log("Password does not match");
      openModal();
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.put(
        `${apiUrl}/userInformation/updatePassword/${id}`,
        { newPassword: formData.newPassword },
        { headers }
      );
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleConfirmation = () => {
    setConfirmModal(true);
    closeModal();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputField
          label="New Password"
          id="newPassword"
          value={formData.newPassword}
          placeholder="Enter new password"
          onChange={handleChange}
          type="password"
        />
        <InputField
          label="Confirm Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm new password"
          onChange={handleChange}
          type="password"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type="Warning"
        messsage="Password does not match"
        onConfirm={handleConfirmation}
      />
    </div>
  );
};

export default UpdatePassword;
