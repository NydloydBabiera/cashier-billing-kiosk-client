import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PrintTable = ({ data, setIsPrinting }) => {
  const tableRef = useRef();

  const generatePDF = async () => {
    const tableElement = tableRef.current;
    if (!tableElement) return;

    const canvas = await html2canvas(tableElement, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [8.5, 13],
    });

    const imgWidth = 8.5;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("PromissoryPayments.pdf");
  };

  return (
    <div className="p-4">
      <div
        ref={tableRef}
        className="bg-white p-4 rounded shadow-md"
        style={{ maxWidth: "100%", overflowX: "auto" }}
      >
        <h1 className="text-2xl text-center font-bold mb-4">Promissory Payments</h1>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white uppercase text-lg">
              <th className="py-2 px-4">Full Name</th>
              <th className="py-2 px-4">Transaction Number</th>
              <th className="py-2 px-4">Amount Due</th>
              <th className="py-2 px-4">Payment Amount</th>
              <th className="py-2 px-4">Exam Term</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tuition, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {`${tuition.tuition.student.information.firstName} ${
                    tuition.tuition.student.information.middleName
                  } ${tuition.tuition.student.information.lastName}`}
                </td>
                <td className="border px-4 py-2">{tuition.transaction_code}</td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(tuition.amount_due || 0)}
                </td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(tuition.amt_paid || 0)}
                </td>
                <td className="border px-4 py-2">
                  {tuition.exam_type.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={generatePDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download PDF
      </button>
      <button
        onClick={() => setIsPrinting(false)}
        className="mt-4 m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Cancel
      </button>
     
    </div>
  );
};

export default PrintTable;