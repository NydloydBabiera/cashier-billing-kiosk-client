import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import AddStudentTuitionForm from "../components/AddStudentTuitionForm";
import InputField from "../components/common/InputField";
import { format, formatDate } from "date-fns";
import List from "../components/common/List";

const StudentTuitionPage = () => {
  const [data, setData] = useState([]);
  const [paymentData, setpaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPmtHistoryOpen, setPmtHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rfidData, setRfidData] = useState("");
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [studentData, setStudentData] = useState({});
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openPmthistory = () => setPmtHistoryOpen(true);
  const closePmthistory = () => setPmtHistoryOpen(false);
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/tuition/getAllStudentTuition`
      );
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/transactions/getAllTransactions`
      );
      setpaymentData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };

  // Fetch data from the API
  useEffect(() => {
    fetchData();
    fetchPayments();
  }, []);

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleOnclickRow = (tuition) => {
    setStudentData(tuition);

    openModal();
  };
  const handleViewPaymnent = (tuition) => {
    console.log(tuition);
    setSelectedPayment(tuition);
    setPmtHistoryOpen(true);
  };
  const payments = selectedPayment
    ? paymentData.filter(
      (payment) => payment.tuition?.student?.rfid_id === selectedPayment
    )
    : [];

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
          <button
            type="submit"
            // onClick={openModal}
            className="bg-blue-500 font-title text-xl text-white font-medium ml-5 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            ADD
          </button>
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
                <th className="py-3 px-6 font-heading">Balance</th>
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
                      {!tuition.information.student?.tuition_amt
                        ? 0
                        : new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(tuition.information.student?.tuition_amt)}
                    </td>

                    <td className="py-3 px-6 text-center uppercase">
                      {!tuition.information.student?.tuition
                        ? 0
                        : !tuition.information.student?.tuition.length > 0
                          ? new Intl.NumberFormat("em-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(tuition.information.student?.tuition_amt)
                          : new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(
                            tuition.information.student?.tuition_amt -
                            tuition.information?.student?.tuition.reduce(
                              (acc, curr) => acc + curr.amt_paid,
                              0
                            )
                          )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        type="submit"
                        onClick={() => handleOnclickRow(tuition)}
                        className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        ADD TUITION
                      </button>
                      <button
                        type="submit"
                        onClick={() =>
                          handleViewPaymnent(tuition.information.rfid_id)
                        }
                        className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Payments
                      </button>
                      {/* {!tuition.information.student?.tuition_amt ? (
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
                          onClick={() =>
                            handleViewPaymnent(tuition.information.rfid_id)
                          }
                          className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                          Payments
                        </button>
                      )} */}
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
          <Modal
            isOpen={isPmtHistoryOpen}
            onClose={closePmthistory}
            title="Payment History"
          >
            <List paymentData={payments} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StudentTuitionPage;
