import React, { useState, useEffect } from "react";
import StudentInformationCard from "./StudentInformationCard";
import axios from "axios";

function RFIDReader() {
  const [rfidData, setRfidData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [debouncedRfid, setDebouncedRfid] = useState("");


  const dummyData = {
    student_tuition_details_id: 1,
    tuition_amt: 23441.12,
    user_identification_id: 1,
    student: {
      user_identification_id: 1,
      id_number: 1234,
      rfid_id: "4321",
      user_type: "STUDENT",
      createdAt: "2024-11-08T08:04:08.091Z",
      updatedAt: "2024-11-08T08:04:08.091Z",
      user_information_id: 1,
    },
  };

 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRfid(rfidData);
    }, 500);

    // Clear the timeout if rfid changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [rfidData]);

  useEffect(() => {
    if (debouncedRfid) {
      handleRfidSubmit(debouncedRfid);
    }
  }, [debouncedRfid]);

  const handleInputChange = async(e) => {
    setRfidData(e.target.value);

  };

  const clearData = () => setRfidData("");

  const handleRfidSubmit = async (rfidValue) => {
    try {
      const response = await axios.get(
        `http://localhost:6100/tuition/getStudentTuition/${rfidValue}`
      );
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-handwriting font-bold mb-4 text-center text-gray-700">
        Tap your RFID to begin transaction
      </h2>

      <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
        {/* <p className="text-gray-600">{handleInputChange || "No data scanned"}</p> */}
        <input
        type="text"
        value={rfidData}
        onChange={handleInputChange}
        placeholder="Scan RFID to begin transaction"
        className="border p-2 rounded w-full"
      />
      </div>
      <button
        onClick={clearData}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
      >
        Clear Data
      </button>

      {rfidData ? <StudentInformationCard studentData={data} /> : ""}
    </div>
  );
}

export default RFIDReader;
