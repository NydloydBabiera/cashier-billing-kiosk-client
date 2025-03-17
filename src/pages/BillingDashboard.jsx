  import React, { useEffect, useState } from "react";
  import StudentInformationCard from "../components/StudentInformationCard";
  import RFIDReader from "../components/RFIDReader";
  import icon from "../assets/coin-bill-acceptor logo.png";
  import io from 'socket.io-client';
  import PaymentReceiver from "../components/PaymentReceiver";
  const BillingDashboard = () => {

    const [getPaymentType, setPaymentType] = useState(null)
    const [isPromisory, setIsPromisory] = useState(null)

    const onPaymentType = (val) => setIsPromisory(val)

    return (

      <div className="h-screen content-center place-items-center">
        <div className="bg-transparent">
          <img className="bg-transparent h-24 w-auto" src={icon}></img>
        </div>
        {/* <h1 className="text-black font-handwriting text-5xl ">
          <strong>RFID</strong> - based Bill and Coin Acceptor Cashiering
        System
      </h1> */}
      {/* <div className={`${isPromisory == null ? `block` : `hidden`}`}>
        <button
          type="submit"
          onClick={() => onPaymentType(false)}
          className="bg-blue-500 text-white text-4xl w-full font-handwriting px-2 my-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Full Payment
        </button>
        <button
          type="submit"
          onClick={() => onPaymentType(true)}
          className="bg-blue-500 text-white  text-4xl w-full font-handwriting px-2 my-2 rounded-lg hover:bg-blue-600 transition duration-200"
        > 
          Promisory Payment
        </button>
      </div> */}
      {/* <div className={`place-items-center content-center ${isPromisory == null ? `hidden` : `block`}`}> */}
      <div className={`place-items-center content-center`}>

        <div className="place-items-center content-center">
          <RFIDReader isPromisory/>
          {/* <button
            type="submit"
            onClick={() =>window.location.reload()}
            className="bg-blue-500 text-white  text-2xl w-full font-handwriting px-2 my-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
