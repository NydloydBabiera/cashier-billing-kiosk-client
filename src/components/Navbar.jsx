import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const userRole = localStorage.getItem("roles");
  return (
    <nav className="bg-blue-700 border-b border-blue-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <Link to="/">
              {/* <img className="h-10 w-auto" src={logo} alt="React Jobs" /> */}
              <span className="hidden md:block text-white text-2xl font-handwriting font-bold ">
                <strong>RFID</strong>-BCACS
              </span>
            </Link>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <Link
                  to="/landingPage"
                  className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  Home
                </Link>
                {userRole === "ADMIN" && (
                  <NavLink
                    to="/users"
                    className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                  >
                    Users
                  </NavLink>
                )}
                {userRole == "TREASURY" && (
                  <>
                    <Link
                      to="/promisory"
                      className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                    >
                      Promisory
                    </Link>
                  </>
                )}
                {userRole == "CASHIER" && (
                  <Link
                    to="/tuition"
                    className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                  >
                    Tuition Information
                  </Link>
                 
                )}
                {/* <Link
                  to="/dashboard"
                  className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  Billing Dashboard
                </Link> */}
                <Link
                  to="/"
                  onClick={() => localStorage.clear()}
                  className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  Logout
                </Link>
                <h1 className="text-white font-handwriting hover:text-white rounded-md px-3 py-2">
                  {" "}
                  {`Logged in as:${userRole}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
