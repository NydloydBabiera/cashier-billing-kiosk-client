import axios from "axios";
import React, { useEffect, useState } from "react";
import AddUserForm from "../components/AddUserForm";
import Modal from "../components/common/Modal";
import RFIDReader from "../components/RFIDReader";
import ScanRFID from "../components/common/ScanRFID";
import { Link } from "react-router-dom";
import MessageModal from "../components/common/MessageModal";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rfidData, setRfidData] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/userInformation/getAllUsers`
      );
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
      setData([])
    }
  };
  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleFormSubmit = (data) => {
    console.log("Form submitted with data:", data);
    closeModal();
  };

  const handleInputChange = (e) => {
    setRfidData(e.target.value);
    setSearchTerm(e.target.value);
  };

  // Filter the data based on the search term (case insensitive)
  const filteredData = searchTerm
    ? data.filter(
        (item) =>
          item.firstName.includes(searchTerm) ||
          item.middleName.includes(searchTerm) ||
          item.lastName.includes(searchTerm) ||
          String(item.information.id_number).includes(searchTerm) ||
          String(item.information.rfid_id).includes(searchTerm)
      )
    : data;

  return (
    <div className="h-screen">
      <div className="container mx-auto p-4">
        <span className="hidden md:block text-black text-3xl font-heading font-bold ml-2">
          User Information
        </span>
        <div className="flex items-center justify-between content-center">
          <input
            type="text"
            value={rfidData}
            onChange={handleInputChange}
            placeholder="Scan RFID to search or add user"
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            onClick={openModal}
            className="bg-blue-500 font-title text-xl text-white font-medium ml-5 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            ADD
          </button>
          {/* <MessageModal  isOpen={true}
            onClose={closeModal}
            type="Confirmation"
            messsage="Confrmation message">
           
          </MessageModal> */}

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="User Information"
          >
            <AddUserForm
              onSubmit={handleFormSubmit}
              onSubmitSuccess={fetchData}
            />
          </Modal>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full  border border-black-500 shadow-md text-white">
            <thead>
              <tr className="bg-blue-500 uppercase text-xl leading-normal">
                <th className="py-3 px-6 font-heading">First Name</th>
                <th className="py-3 px-6 font-heading">Middle Name</th>
                <th className="py-3 px-6 font-heading">Last Name</th>
                <th className="py-3 px-6 font-heading">RFID</th>
                <th className="py-3 px-6 font-heading">ID Number</th>
                <th className="py-3 px-6 font-heading">Type</th>
              </tr>
            </thead>
            <tbody className="text-slate-950 text-base font-display">
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center uppercase">
                      {user.firstName}
                    </td>
                    <td className="py-3 px-6 text-center  uppercase">
                      {user.middleName}
                    </td>
                    <td className="py-3 px-6 text-center uppercase">
                      {user.lastName}
                    </td>
                    <td className="py-3 px-6 text-center uppercase">
                      {user.information.rfid_id}
                    </td>
                    <td className="py-3 px-6 text-center uppercase">
                      {user.information.id_number}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {user.information.user_type}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
