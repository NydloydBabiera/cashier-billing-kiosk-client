import React, { useState } from "react";
import InputField from "./common/InputField";
import Combobox from "./common/Combobox";
import PropTypes from "prop-types";
import axios from "axios";

const AddUserForm = ({ onSubmit, onSubmitSuccess  }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    rfidNumber: "",
    userType: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  
  // const [rfidNumber, setrfidNumber] = useState("");

  const handleRfidChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      rfidNumber: e.target.value, // Update rfidNumber with scanned value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update the corresponding field in the form data
    }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        "http://localhost:6100/userInformation/createUser",
        formData, {headers}
      );
      onSubmitSuccess()
      setResponseMessage(`Success! User created with ID: ${response.data.id}`);
    } catch (error) {
      setResponseMessage("An error occurred while submitting the form.");
      console.error("Error submitting form:", error);
    }
    console.log("Form submitted:", formData);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputField
          label="First Name"
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
        />

        <InputField
          label="Middle Name"
          id="middleName"
          type="text"
          value={formData.middleName}
          onChange={handleChange}
          placeholder="Enter your middle name"
        />

        <InputField
          label="Last Name"
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
        />

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Identification
        </h2>

        <InputField
          label="Student ID number"
          id="idNumber"
          type="text"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="Enter your ID number"
        />

        <InputField
          label="RFID code"
          id="rfidNumber"
          type="text"
          value={formData.rfidNumber}
          onChange={handleRfidChange}
          placeholder="RFID"
        />

        <Combobox
          label="Select a type"
          id="userType"
          options={["ADMIN", "STUDENT", "TREASURY"]}
          value={formData.userType}
          onChange={handleChange} // Passing handleChange to update the form data
          placeholder="Type to search for type"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>}
    </div>
  );
};
export default AddUserForm;
