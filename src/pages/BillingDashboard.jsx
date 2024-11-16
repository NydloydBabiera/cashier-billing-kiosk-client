import React, { useState } from "react";
import StudentInformationCard from "../components/StudentInformationCard";
import RFIDReader from "../components/RFIDReader";
import icon from "../assets/coin-bill-acceptor logo.png";
const BillingDashboard = () => {
  return (
    <div className="flex mb-4 h-screen">
      <div className="w-1/2 bg-blue-500 content-center place-items-center">
        <div className="place-items-center bg-blue-500 rounded-md w-80 ">
          <h1 className="text-white font-handwriting text-5xl mx-5 place-items-center">
            <strong>RFID</strong> - based Bill and Coin Acceptor Cashiering
            System
          </h1>
        </div>
      </div>
      <div className="w-1/2 bg-whiter-500 content-center place-items-center">
        <div className="bg-transparent">
          <img className="bg-transparent h-24 w-auto" src={icon}></img>
        </div>
        <div className="place-items-center content-center">
          <RFIDReader />
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
