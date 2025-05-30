import React, { useState, useEffect, useRef } from "react";
import StudentInformationCard from "./StudentInformationCard";
import axios from "axios";
import InputField from "./common/InputField";
import io from "socket.io-client";
import PaymentReceiver from "./PaymentReceiver";
import Modal from "./common/Modal";
import MessageModal from "./common/MessageModal";
// const socket = io('');
function RFIDReader({ isPromisory }) {
  const [rfidData, setRfidData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [debouncedRfid, setDebouncedRfid] = useState("");
  const [paymentAmt, setPaymentAmt] = useState("");
  const [arduinoData, setArduinoData] = useState("");
  const [isForPmt, setIsForPmt] = useState(false);
  const [insertAmt, setInsertAmt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [msgType, setMsgType] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const inputRef = useRef(null)
  // const apiUrl = import.meta.env.VITE_API_URL
  const apiUrl = 'http://localhost:6100'
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
    if (inputRef.current) {
      inputRef.current.focus();
      sendCommand(0);
    }
    // Connect to WebSocket server
    const socket = io("http://localhost:3000");

    // Listen for data from Arduino
    // socket.on("arduino-data", (data) => {
    socket.on("arduino-data", (data) => {
      console.log("Data from Arduino:", data);
      setInsertAmt(data); // Update sensor data
    });
    // socket.on('arduino-data', (highest) => {
    //   console.log('Highest Value:', highest);
    // });
    // Cleanup on unmount
    return () => socket.disconnect();
  }, []);
  // useEffect(() => {
  //   // Listen for the 'arduinoData' event from the server
  //   // socket.on('arduinoData', (data) => {
  //   //   console.log('Received from Arduino:', data);
  //   //   setArduinoData(data);  // Update state with received data
  //   // });

  //   // // Listen for other events if needed
  //   // socket.on('arduinoMessage', (message) => {
  //   //   console.log('Received WebSocket message:', message);
  //   // });

  //   // return () => {
  //   //   // Cleanup WebSocket connection when component unmounts
  //   //   socket.off('arduinoData');
  //   //   socket.off('arduinoMessage');
  //   // };
  // }, []);

  // const sendCommand = (command) => {
  //   console.log('Sending command to server:', command);
  //   socket.emit(command);  // Send the command to the server
  // };

  const handleInputChange = async (e) => {
    setRfidData(e.target.value);
  };

  const handleInputPayment = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmt(newValue);
  };

  const handleManualInpuntPayment = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setInsertAmt(newValue);
  };

  const handleInsertPayment = () => {
    if (!paymentAmt) {
      setMsgType("Warning");
      setModalMsg(
        "Please input payment amount"
      );
      openModal();
      return;
    }

    if (paymentAmt) {
      setMsgType("Warning");
      setModalMsg(`You're about to pay Php ${paymentAmt} pesos for your balance, NOTE: Once made, this payment can't be changed or undone! WOULD YOU LIKE TO PROCEED?`)
      openModal()
      // return;

      if (data.amt_balance > paymentAmt) {
        console.log(paymentAmt)
        setMsgType("Information");
        setModalMsg(
          "YOU HAVE NOT met the full payment of your remaining balance, this payment will be processed as a PROMISSORY. Would you like to proceed?"
        );
        openModal();
        return;
      }
    }

    // if (data.amt_balance > paymentAmt && !isModalOpen) {
    //   console.log(paymentAmt)
    //   setMsgType("Information");
    //   setModalMsg(
    //     "YOU HAVE NOT met the full payment of your remaining balance, this payment will be processed as a PROMISSORY. Would you like to proceed?"
    //   );
    //   openModal();
    //   return;
    // }
    setIsForPmt(true);
    sendCommand(1);
  };

  const handleConfirmation = () => {
    setConfirmModal(true);
    closeModal();
    setIsForPmt(true);
    sendCommand(1);
  };

  const clearData = () => {
    setRfidData("");
    sendCommand(0);
    window.location.reload();
  };

  const handleRfidSubmit = async (rfidValue) => {
    try {
      const response = await axios.get(
        `${apiUrl}/tuition/getStudentTuition/${rfidValue}`
      );
      console.log('response:', Object.keys(response.data).length)

      if (Object.keys(response.data).length === 0) {
        setMsgType("Warning");
        setModalMsg("User not found");
        openModal();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }

      setData(response.data); // Set the fetched data
      setLoading(false);
      sendCommand("on");
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };
  const handlePaymentSubmit = async () => {
    let messageHigh = 'The amount you have paid is MORE THAN the required amount you entered. PLEASE NOTE that it will still be credited to your account. Once made, this payment can\'t be changed or undone. WOULD YOU LIKE TO PROCEED WITH THIS PAYMENT?'
    let messageLow = 'The amount you have paid is LESS THAN the required amount you entered. PLEASE NOTE that it will be credited as a promissory payment. However your outstanding balance will remain unpaid in full. Once made, this payment can\'t be changed or undone. WOULD YOU LIKE TO PROCEED WITH THIS PARTIAL PAYMENT?'
    if (insertAmt >= paymentAmt) {
      setMsgType("Warning");
      setModalMsg(messageHigh);
      openModal();
      return
    } else if (insertAmt <= paymentAmt) {
      setMsgType("Warning");
      setModalMsg(messageLow);
      openModal();
      return
    }

    if (data)
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          `${apiUrl}/transactions/addTuitionPayment`,
          {
            amt: insertAmt,
            student_tuition_id: data.tuition_id,
            isPromiPayment: insertAmt < data.amt_balance,
            amount_due: data.amt_balance,
            isApproved: insertAmt == data.amt_balance ? true : null,
            remarks: insertAmt == data.amt_balance ? "FULLY PAID" : null,
          },
          { headers }
        );
        // add success modal or confirmation here
        console.log(response);
        // clearData()

        sendCommand(0);
        if (response)
          //print receipt modal
          setMsgType("Information");
        setModalMsg("Receipt is printing, please wait for a while...");
        openModal();
        printReceipt(response.data.tuition_payment_transaction_id)
        // window.location.reload();
      } catch (error) {
        // add error modal or confirmation here
        console.error("Error submitting form:", error);
      }
  };

  const printReceipt = async (transaction_id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${apiUrl}/transactions/printReceipt/${transaction_id}`,

        { headers }
      );
      // add success modal or confirmation here
      console.log(response);
      // clearData()


      if (response) {
        setMsgType("Information");
        setModalMsg("Payment successful, Please get your receipt");
        setTimeout(() => {
          // closeModal();
          // openModal();
          window.location.reload();
        }, 5000);

      }
      // window.location.reload();
    } catch (error) {
      // add error modal or confirmation here
      console.error("Error submitting form:", error);
    }
  }
  const handleInsertAmt = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setInsertAmt(newValue);
  };
  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setTuitionAmt(newValue);
  };

  const sendCommand = async (command) => {
    try {
      const res = await axios.post("http://localhost:3000/command", {
        command,
      });
      console.log(res.data.response);
      setInsertAmt(res.data.response); // Update the response state
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };
  return (
    <div className="">
      <div className={isForPmt ? `hidden` : `block`}>
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
            ref={inputRef}
          />
        </div>

        {rfidData ? (
          <button
            onClick={clearData}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            CANCEL
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
          // disabled={false}
          // value={arduinoData}
          />

        ) : (
          ""
        )}

        {rfidData ? (
          <button
            onClick={handleInsertPayment}
            className="w-full bg-indigo-600 text-2xl text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Proceed Payment
          </button>

        ) : (
          ""
        )}
      </div>
      {isForPmt ? (
        <div>
          <h2 className="text-5xl font handwriting font-bold mb-4 text-center">
            Insert your payment
          </h2>
          <h2 className="text-5xl font handwriting font-bold text-center">
            Amount: {paymentAmt}
          </h2>
          {/* <InputField
            label=""
            id="insertAmt"
            placeholder="Inserted Amount Payment"
            value={insertAmt}
          // disabled={false}
          /> */}
          <input
            value={insertAmt}
            onChange={handleManualInpuntPayment}
            className="text-center text-4xl w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          // disabled={true}
          />
          <button
            onClick={handlePaymentSubmit}
            className="w-full bg-indigo-600 text-2xl text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Submit Payment
          </button>{" "}
          {!insertAmt ? (<button
            type="submit"
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white  text-2xl w-full font-handwriting px-2 my-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Cancel
          </button>) : ""}

        </div>

      ) : (
        ""
      )}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={msgType}
        messsage={modalMsg}
        onConfirm={handleConfirmation}
      />
    </div>
  );
}

export default RFIDReader;
