import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import AddStudentTuitionForm from "../components/AddStudentTuitionForm";

const StudentTuitionPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rfidData, setRfidData] = useState("");
  const [studentData, setStudentData] = useState({});
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6100/tuition/getAllStudentTuition"
      );
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };
  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleOnclickRow = (tuition) => {
    setStudentData(tuition);

    openModal();
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
          Student Tuition Information
        </span>
        <div className="flex items-center my-2 justify-between content-center">
          <input
            type="text"
            value={rfidData}
            onChange={handleInputChange}
            placeholder="Scan RFID or type user details to search user"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full  border border-black-500 shadow-md text-white">
            <thead>
              <tr className="bg-blue-500 uppercase text-xl leading-normal">
                <th className="py-3 px-6 font-heading">First Name</th>
                <th className="py-3 px-6 font-heading">Middle Name</th>
                <th className="py-3 px-6 font-heading">Last Name</th>
                <th className="py-3 px-6 font-heading">ID Number</th>
                <th className="py-3 px-6 font-heading">Tuition Amount</th>
                <th className="py-3 px-6 font-heading">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-950 text-base font-display">
              {filteredData.length > 0 ? (
                filteredData.map((tuition) => (
                  <tr
                    key={tuition.user_id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center uppercase">
                      {tuition.firstName}
                    </td>
                    <td className="py-3 px-6 text-center  uppercase">
                      {tuition.middleName}
                    </td>
                    <td className="py-3 px-6 text-center uppercase">
                      {tuition.lastName}
                    </td>
                    <td className="py-3 px-6 text-center uppercase">
                      {tuition.information.id_number}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {tuition.information.student?.tuition_amt}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {!tuition.information.student?.tuition_amt ? (
                        <button
                          type="submit"
                          onClick={() => handleOnclickRow(tuition)}
                          className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          ADD TUITION
                        </button>
                      ) : (
                        <button
                          type="submit"
                          onClick={openModal}
                          className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          View Details
                        </button>
                      )}
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
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Tuition Details"
          >
            <AddStudentTuitionForm
              onClose={closeModal}
              studentData={studentData}
              onSubmitSuccess={fetchData}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StudentTuitionPage;
