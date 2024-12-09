import React, { useState, useEffect } from "react";
import StudentInformationCard from "./StudentInformationCard";
import axios from "axios";
import InputField from "./common/InputField";
import io from 'socket.io-client';
const socket = io('');
function RFIDReader() {
  const [rfidData, setRfidData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [debouncedRfid, setDebouncedRfid] = useState("");
  const [paymentAmt, setPaymentAmt] = useState("");
  const [arduinoData, setArduinoData] = useState('');

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

  useEffect(() => {
    // Listen for the 'arduinoData' event from the server
    socket.on('arduinoData', (data) => {
      console.log('Received from Arduino:', data);
      setArduinoData(data);  // Update state with received data
    });

    // Listen for other events if needed
    socket.on('arduinoMessage', (message) => {
      console.log('Received WebSocket message:', message);
    });

    return () => {
      // Cleanup WebSocket connection when component unmounts
      socket.off('arduinoData');
      socket.off('arduinoMessage');
    };
  }, []);

  const sendCommand = (command) => {
    console.log('Sending command to server:', command);
    socket.emit(command);  // Send the command to the server
  };

  const handleInputChange = async (e) => {
    setRfidData(e.target.value);
  };

  const handleInputPayment = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmt(newValue);
  };

  const clearData = () => { setRfidData(""); sendCommand('off'); };

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
      sendCommand('on')
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };
  const handlePaymentSubmit = async () => {

    if (data)
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

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setTuitionAmt(newValue);
  };
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-handwriting font-bold mb-4 text-center text-gray-700">
        Tap your RFID to begin transaction
      </h2>

      <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
        {/* <p className="text-gray-600">{handleInputChange || "No data scanned"}</p> */}
        <input
          type="text"
          value={rfidData}
          onChange={handleInputChange}
          placeholder="Scan RFID to begin transaction"
          className="border p-2 rounded w-full text-3xl"
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
          // type="number"
          placeholder="Payment"
          onChange={handleInputPayment}
          // disabled={false}
          // value={arduinoData}
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
