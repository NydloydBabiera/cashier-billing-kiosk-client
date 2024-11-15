import React, { useEffect, useState } from "react";
import InputField from "./common/InputField";
import axios from "axios";

const AddStudentTuitionForm = ({ studentData, onSubmitSuccess, onClose }) => {
  const [tuitionAmt, setTuitionAmt] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setTuitionAmt(newValue);
  };
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async () => {
    console.log("reached here");
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        "http://localhost:6100/tuition/addStudentTuition",
        {
          user_identification_id:
            studentData.information?.user_identification_id,
          tuition_amt: tuitionAmt,
        },
        { headers }
      );
      onSubmitSuccess();
      onClose()
      setResponseMessage(`Success! User created with ID: ${response.data.id}`);
    } catch (error) {
      setResponseMessage("An error occurred while submitting the form.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <InputField
        label="First Name"
        id="firstName"
        type="text"
        value={studentData.firstName}
        placeholder="Enter your first name"
        disabled={true}
      />

      <InputField
        label="Middle Name"
        id="middleName"
        type="text"
        value={studentData.middleName}
        placeholder="Enter your middle name"
        disabled={true}
      />

      <InputField
        label="Last Name"
        id="lastName"
        type="text"
        value={studentData.lastName}
        placeholder="Enter your last name"
        disabled={true}
      />

      <InputField
        label="Amount"
        id="lastName"
        type="text"
        value={tuitionAmt}
        onChange={handleChange}
        placeholder="Enter tuition amount"
        disabled={false}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
      {/* {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>} */}
    </div>
  );
};
// AddStudentTuitionForm.prototype = {
//   data: PropTypes.shape({
//     firstName: PropTypes.string.isRequired,
//     middleName: PropTypes.string.isRequired,
//     lastName: PropTypes.string.isRequired,
//   }).isRequired,
// };
export default AddStudentTuitionForm;
