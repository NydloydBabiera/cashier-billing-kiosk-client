import { format } from "date-fns";
import PropTypes from "prop-types";
import React from "react";

const List = ({ paymentData }) => {
  console.log("paymentData:", paymentData);
  return (
    <div>
      <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        {paymentData.length > 0 ? (
          paymentData.map((payment) => (
            <div className="flex flex-col pb-3">
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
          <p className="text-gray-500">No data available.</p>
        )}
      </dl>
    </div>
  );
};

List.propTypes = {
  paymentData: {},
};

export default List;
