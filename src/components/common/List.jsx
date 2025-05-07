import { format } from "date-fns";
import PropTypes from "prop-types";
import {React, useState} from "react";

const List = ({ paymentData }) => {
  // paymentData.map((payment) => console.log(payment))
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = [...paymentData].sort(
    (a, b) => b.tuition_payment_transaction_id - a.tuition_payment_transaction_id
  );

  const totalPages = Math.ceil(paymentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        {currentData.length > 0 ? (
          currentData.map((payment, index) => (
            <div className="flex flex-col pb-3" key={index}>
              <dt className="text-base mb-1">
                <strong>{payment.transaction_code}</strong> -{" "}
                {format(payment.transaction_date, "MMM dd, yyyy HH:mm:ss")}
              </dt>
              <dd className="text-heading text-lg">
                Amount:{" "}
                <strong>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(payment.amt_paid)}
                </strong>
              </dd>
            </div>
          ))
        ) : (
          <p>No payment data found.</p>
        )}
      </dl>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  paymentData: {},
};

export default List;
