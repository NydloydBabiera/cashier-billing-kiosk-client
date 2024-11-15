import React from "react";
import InputField from "./common/InputField";

const StudentInformationCard = ({studentData}) => {
  console.log("studentData:",studentData)
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
        label="Amount Due"
        id="lastName"
        type="text"
        value={studentData.amount_due}
        placeholder="Amount Due"
        disabled={true}
      />

      <InputField
        label="Payment"
        id="lastName"
        type="text"
        value={studentData.balance}
        placeholder="Payment"
        disabled={false}
      />

      </div>
  );
};

export default StudentInformationCard;
