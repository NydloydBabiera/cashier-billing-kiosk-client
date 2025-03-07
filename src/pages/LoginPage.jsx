import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageModal from "../components/common/MessageModal";
import Modal from "../components/common/Modal";
import UpdatePassword from "../components/UpdatePassword";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataResponse, setDataResponse] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [msgType, setMsgType] = useState("");
  const [modalMsg, setModalMsg] = useState("");
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [updatePassModal, setUpdatePassModal] = useState(false);
  const openUpdatePassModal = () => setUpdatePassModal(true);
  const closeUpdatePassModal = () => {
    setPassword("");
    setUpdatePassModal(false);
  };
  const apiUrl = import.meta.env.VITE_API_URL
  console.log(apiUrl)

  useEffect(() => {
    // Clear the password value on page reload
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/userInformation/authenticateUser`,
        { username, password },
        { headers }
      );

      if (response.data === null) {
        setMsgType("Information");
        setModalMsg("No user found");
        openModal();
      }
      setDataResponse(response.data);
      localStorage.setItem("roles", response.data.identification.user_type);

      console.log(response.data);
      console.log(dataResponse);
      if (response.data.isFirstLogin) {
        openUpdatePassModal();
        return;
      }

      if (
        response.data.identification.user_type === "ADMIN" ||
        response.data.identification.user_type === "TREASURY" ||
        response.data.identification.user_type === "CASHIER"
      ) {
        navigate("/landingPage");
      }


    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmation = () => {
    setConfirmModal(true);
    closeModal();
  };

 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
          >
            Login
          </button>
        </form>
        {/* <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p> */}
      </div>
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={msgType}
        messsage={modalMsg}
        onConfirm={handleConfirmation}
      />

      <Modal
        isOpen={updatePassModal}
        onClose={closeUpdatePassModal}
        title="Update password"
      >
        <UpdatePassword
          onSubmit={closeUpdatePassModal}
          id={dataResponse?.authenticate_user_id}
          onSubmitSuccess={closeUpdatePassModal}
        />
      </Modal>
    </div>
  );
};

export default LoginPage;
