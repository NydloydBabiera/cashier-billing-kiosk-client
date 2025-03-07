import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import AddStudentTuitionForm from "../components/AddStudentTuitionForm";
import InputField from "../components/common/InputField";
import { format, formatDate } from "date-fns";
import List from "../components/common/List";
import PrintTable from "../components/common/PrintTable";
import { useNavigate } from "react-router-dom";
import PromisorryApproval from "../components/PromisorryApproval";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [selectedTransactionId, setSelectedTransactionId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isApproved, setIsApproved] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL

  const options = [
    { value: "ALL", label: "ALL" },
    { value: "PROMI", label: "PROMI" },
    { value: "FULL", label: "FULL" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/tuition/getPromisoryPayments`
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
  //         "${apiUrl}/tuition/getPromisoryPayments"
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
    // setSelectedPayment(tuition);
    setSelectedTransactionId(tuition.tuition_payment_transaction_id);
    openModal();
    // generatePromissoryForm(tuition)
  };

  const generatePromissoryForm = (tuition) => {
    const doc = new jsPDF();
    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("PROMISSORY FORM", 105, 20, { align: "center" });

    const amount = tuition.amount_due;
    const formattedAmount = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    // Paragraph Text
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const text = `  Please be informed that in order to claim your examination permit, you are required to settle the outstanding balance or pay the required amount at the Cashier’s Office. The permit will not be released until the full payment is made.`;
    doc.text(text, 20, 30, { maxWidth: 170 }, { align: "justify" });

    // Table
    autoTable(doc, {
      startY: 50,
      head: [["No.", "NAME", "AMOUNT DUE", "REMARKS"]],
      body: [
        [
          `${tuition.tuition_payment_transaction_id}`,
          `${tuition.tuition.student.information.firstName.toUpperCase()} ${tuition.tuition.student.information.middleName.toUpperCase()} ${tuition.tuition.student.information.lastName.toUpperCase()}`,
          `${tuition.amount_due}`,
          tuition.remarks || "",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 12, halign: "center" },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0.2]
      },
      bodyStyles: {
        lineWidth: 0.1, // Border thickness for body rows
        lineColor: [0, 0, 0], // Black border for body rows
      },
      tableLineWidth: 0.2, // ✅ Ensures borders for all cells
      tableLineColor: [0, 0, 0.2] // ✅ Black border for all lines
    });

    // Additional Notes
    const notes = `Kindly ensure that all payments are completed before the examination date, as failure to do so may result in being unable to take the examination.
  
For any inquiries regarding payment details, please contact the Cashier’s Office.
  
Thank you for your prompt attention to this matter.`;
    doc.text(notes, 20, doc.lastAutoTable.finalY + 10, { maxWidth: 170 });

    // Signature Lines
    const yPos = doc.lastAutoTable.finalY + 50;
    doc.line(30, yPos, 100, yPos); // Student Signature Line
    doc.line(130, yPos, 190, yPos); // Treasury Officer Line

    // Signature Labels
    doc.setFontSize(10);
    doc.text("Student’s Signature", 40, yPos + 5);
    doc.text("Treasury Officer", 150, yPos + 5);

    // Open PDF Preview in New Tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
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

  const handleOnSubmit = async () => {
    fetchData();
    closeModal();
    
    try {
      const response = await axios.get(
        `${apiUrl}/transactions/getSpecificTransaction/${studentData.tuition_payment_transaction_id}`
      );
      console.log('response:', response.data[0])
      generatePromissoryForm(response.data[0])
    } catch (err) {
      setError("Error fetching data", err.message);
    }

    // if (isApproved) {
    //   generatePromissoryForm(rowData)
    // }
    console.log('isApproved:', isApproved)
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

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the dropdown after selecting an option
    if (option.value === 'PROMI') {

      console.log(option.value)
      data.filter((pmts) => pmts.isPromiPayment === true)
    } else if (option.value === 'FULL') {
      console.log(option.value)
      data.filter((pmts) => pmts.isPromiPayment === false)
    }

  };

  const handleApprovalStatusChange = (status) => {
    setIsApproved(status);
  };

  return (
    <div className="h-screen">
      <div className={isPrinting ? `hidden` : `block`}>
        <div className="container mx-auto p-4">
          <span className="hidden md:block text-black text-3xl font-heading font-bold ml-2">
            Payments
          </span>
          <div className="flex items-center my-2 justify-between">
            <input
              type="text"
              value={rfidData}
              onChange={handleInputChange}
              placeholder="Scan RFID or type user details to search user"
              className="border p-2 rounded w-full"
            />
            <div className="relative w-64 ml-4">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-64 px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedOption ? selectedOption.label : "Select an option"}
                <span className="float-right text-gray-500">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <ul className="absolute z-10 mt-1 min-w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                <tr className="bg-blue-500 uppercase text-base leading-normal">
                  <th className="py-3 px-6 font-heading">Full Name</th>
                  <th className="py-3 px-6 font-heading">Transaction Number</th>
                  <th className="py-3 px-6 font-heading">Amount Due</th>
                  <th className="py-3 px-6 font-heading">Payment Amount</th>
                  <th className="py-3 px-6 font-heading">Promisory Payment</th>
                  <th className="py-3 px-6 font-heading">Exam Term</th>
                  <th className="py-3 px-6 font-heading">Remarks</th>
                  <th className="py-3 px-6 font-heading">Approved</th>
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
                        {tuition.isPromiPayment ? (
                          <span className="text-green-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-bold">No</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center  uppercase">
                        {tuition.exam_type.toUpperCase()}
                      </td>
                      <td className="py-3 px-6 text-center  uppercase">
                        {tuition.remarks}
                      </td>
                      <td className="py-3 px-6 text-center  uppercase">
                        {tuition.isApproved == null ? (
                          <button
                            type="submit"
                            onClick={() => handleOnclickRow(tuition)}
                            className="bg-blue-500 text-white font-medium px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                          >
                            For Approval
                          </button>
                        ) : tuition.isApproved ? (
                          <span className="text-green-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-bold">No</span>
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
              title="Approve promisorry payment?"
            >
              <PromisorryApproval
                transactionId={selectedTransactionId}
                onSubmitSuccess={handleOnSubmit}
                approvalStatus={handleApprovalStatusChange}
              />
            </Modal>
            {/* <Modal
              isOpen={isPmtHistoryOpen}
              onClose={closePmthistory}
              title="Payment History"
            >
              <List paymentData={payments} />
            </Modal> */}
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
