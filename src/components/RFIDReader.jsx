import React, { useState, useEffect } from "react";
import StudentInformationCard from "./StudentInformationCard";
import axios from "axios";
import InputField from "./common/InputField";

function RFIDReader() {
  const [rfidData, setRfidData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [debouncedRfid, setDebouncedRfid] = useState("");
  const [paymentAmt, setPaymentAmt] = useState("");

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

  const handleInputChange = async (e) => {
    setRfidData(e.target.value);
  };

  const handleInputPayment = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmt(newValue);
  };

  const clearData = () => setRfidData("");

  const handleRfidSubmit = async (rfidValue) => {
    try {
      const response = await axios.get(
        `http://localhost:6100/tuition/getStudentTuition/${rfidValue}`
      );
      {
        loading && <p>Loading...</p>;
      }
      {
        error && <p style={{ color: "red" }}>{error}</p>;
      }
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };
  const handlePaymentSubmit = async () => {
  
    if(data)
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        "http://localhost:6100/transactions/addTuitionPayment",
        {
          amt: paymentAmt,
          student_tuition_id: data.tuition_id,
        },
        { headers }
      );
      // add success modal or confirmation here
      console.log(response);
      clearData()
    } catch (error) {
      // add error modal or confirmation here
      console.error("Error submitting form:", error);
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

      {rfidData ? (
        <button
          onClick={clearData}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Clear Data
        </button>
      ) : (
        ""
      )}
      {rfidData ? <StudentInformationCard studentData={data} /> : ""}
      {rfidData ? (
        <InputField
          label="Payment"
          id="paymenmt"
          type="number"
          placeholder="Payment"
          onChange={handleInputPayment}
          disabled={false}
        />
      ) : (
        ""
      )}
      {rfidData ? (
        <button
          onClick={handlePaymentSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Submit Payment
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default RFIDReader;
