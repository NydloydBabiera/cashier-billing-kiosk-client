import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Modal from "./common/Modal";
import ExamTerm from "./ExamTerm";

const Navbar = () => {
  const userRole = localStorage.getItem("roles");
  const [examTerm, setExamTerm] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const terms = ['PRE-MIDTERM', 'MIDTERM', 'PRE-FINAL', 'FINAL']

  const apiUrl = import.meta.env.VITE_API_URL
  const fetchExamTerm = async () => {
    try {
      const response = await axios.get(`${apiUrl}/exam/getCurrentTerm`)
      console.log(response)
      setExamTerm(response.data.exam_term)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSetExamTerm = async (term) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.post(
        `${apiUrl}/exam/examTerm`,
        { exam_term: term }, { headers }
      )

      if (response) {
        closeModal()
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchExamTerm();
  }), []
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
                  <>
                    <Link
                      to="/tuition"
                      className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                    >
                      Tuition Information
                    </Link>
                    <button
                      className="text-white font-handwriting hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                      onClick={openModal}>
                      {!examTerm ? 'SET EXAM TERM' : examTerm}</button>
                  </>


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
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Set Exam Term"
        >
          {terms.map((t) => (
            <div className="container mx-auto p-4 content-center align-center">
              <button
                onClick={() => handleSetExamTerm(t)}
                className="bg-blue-500 w-96 font-title text-xl text-white font-medium ml-5 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                {t}</button>
            </div>

          ))}
        </Modal>
      </div>

    </nav>
  );
};

export default Navbar;
