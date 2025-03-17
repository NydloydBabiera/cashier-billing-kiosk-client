import React from "react";
import InputField from "./common/InputField";

const StudentInformationCard = ({ studentData }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
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
      </div>

      <div className="flex flex-wrap gap-2">
        <InputField
          label="Balance"
          id="lastName"
          type="text"
          value={studentData?.balance?.toFixed(2)}
          placeholder="Balance"
          disabled={true}
        />
        <InputField
          label="Amount Due"
          id="lastName"
          type="text"
          value={studentData?.amt_balance?.toFixed(2)}
          placeholder="Amount Due"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default StudentInformationCard;
