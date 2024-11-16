import React from "react";
import icon from "../assets/coin-bill-acceptor-logo.svg"

const LandingPage = () => {
  return (
    <div className="content-center place-items-center my-24">
      <div className="place-items-center">
        <h1 className="font-handwriting text-5xl  place-items-center">
        <strong>RFID</strong> - based Bill and Coin Acceptor Cashiering System
        </h1>
        <img className="h-48 w-auto" src={icon}></img>
      </div>
      <div className="flex w-full  py-10">
        <div className="w-1/2 mx-10">
          <h1 className="font-bold">The Web Cashier Self-Payment</h1>
          <p className="text-justify">
            An innovative self-service solution tailored for modern retail
            environments where speed, efficiency, and customer autonomy are
            essential. By allowing customers to independently manage their
            checkout experience, this web-based kiosk reduces queue times,
            enhances customer satisfaction, and enables a smooth, contactless
            transaction process. Whether for groceries, retail stores, or food
            outlets, this kiosk solution provides a streamlined approach to
            payments, helping businesses improve efficiency and focus on
            personalized customer interactions. The responsive design and
            user-friendly interface ensure easy adaptability, whether deployed
            on tablets, touchscreen stations, or mobile devices.
          </p>
        </div>
        <div className="w-1/2 mx-10">
          <h1 className="font-bold">About</h1>
          <p className="text-justify">
            Designed with both retailers and customers in mind, the Web Cashier
            Self-Payment Kiosk offers a secure, intuitive platform for handling
            payments and transactions in a variety of settings. The kiosk system
            integrates easily with existing payment methods, supporting both
            cashless and cash-based options, while offering real-time data
            updates for business insights and inventory tracking. Key features
            include customizable user flows, easy maintenance, and minimal
            training requirements for fast implementation. The kiosk's
            responsive web-based architecture also allows for seamless updates,
            remote monitoring, and scalability, making it ideal for both small
            businesses and large enterprises. Its design emphasizes not only
            customer convenience but also the enhancement of operational
            efficiency, transforming the checkout experience for everyone
            involved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
