import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import AddStudentTuitionForm from "../components/AddStudentTuitionForm";
import InputField from "../components/common/InputField";
import { format, formatDate } from "date-fns";
import List from "../components/common/List";
import PrintTable from "../components/common/PrintTable";
import { useNavigate } from "react-router-dom";

const PromisoryPayments = () => {
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
  const [isPrinting, setIsPrining] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openPmthistory = () => setPmtHistoryOpen(true);
  const closePmthistory = () => setPmtHistoryOpen(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6100/tuition/getPromisoryPayments"
      );
      setData(response.data); // Set the fetched data
      setLoading(false);
    } catch (err) {
      setError("Error fetching data", err.message);
      setLoading(false);
    }
  };

  //   const fetchPayments = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:6100/tuition/getPromisoryPayments"
  //       );
  //       setpaymentData(response.data); // Set the fetched data
  //       setLoading(false);
  //     } catch (err) {
  //       setError("Error fetching data", err.message);
  //       setLoading(false);
  //     }
  //   };

  // Fetch data from the API
  useEffect(() => {
    fetchData();
    // fetchPayments();
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
          item.tuition.student.information.firstName.includes(searchTerm) ||
          item.tuition.student.information.middleName.includes(searchTerm) ||
          item.tuition.student.information.lastName.includes(searchTerm) ||
          String(item.tuition.student.id_number).includes(searchTerm) ||
          String(item.tuition.student.rfid_id).includes(searchTerm)
      )
    : data;

  const handlePrinting = () => {
    setIsPrining(true);
    // navigate("/printTable", { state: { data } });
    // <Route path="/users" element={<UserPage />} />
  };

  return (
    <div className="h-screen">
      <div className={isPrinting ? `hidden` : `block`}>
        <div className="container mx-auto p-4">
          <span className="hidden md:block text-black text-3xl font-heading font-bold ml-2">
            Promisory Payments
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
              onClick={handlePrinting}
              className="bg-blue-500 font-title text-xl text-white font-medium ml-5 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              PRINT
            </button>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full  border border-black-500 shadow-md text-white">
              <thead>
                <tr className="bg-blue-500 uppercase text-xl leading-normal">
                  <th className="py-3 px-6 font-heading">Full Name</th>
                  <th className="py-3 px-6 font-heading">Transaction Number</th>
                  <th className="py-3 px-6 font-heading">Amount Due</th>
                  <th className="py-3 px-6 font-heading">Payment Amount</th>
                  <th className="py-3 px-6 font-heading">Exam Term</th>
                </tr>
              </thead>
              <tbody className="text-slate-950 text-base font-display">
                {filteredData.length > 0 ? (
                  filteredData.map((tuition) => (
                    <tr
                      key={tuition.tuition_payment_transaction_id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-center uppercase">
                        {tuition.tuition.student.information.firstName +
                          " " +
                          tuition.tuition.student.information.middleName +
                          " " +
                          tuition.tuition.student.information.lastName}
                      </td>
                      <td className="py-3 px-6 text-center  uppercase">
                        {tuition.transaction_code}
                      </td>
                      <td className="py-3 px-6 text-center uppercase">
                        {!tuition.amount_due
                          ? 0
                          : new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(tuition.amount_due)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {!tuition.amt_paid
                          ? 0
                          : new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            }).format(tuition.amt_paid)}
                      </td>
                      <td className="py-3 px-6 text-center  uppercase">
                        {tuition.exam_type.toUpperCase()}
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
      <div className={isPrinting ? `block` : `hidden`}>
        <PrintTable data={data} setIsPrinting={setIsPrining} />
      </div>
    </div>
  );
};

export default PromisoryPayments;
