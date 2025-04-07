import React from "react";

const Payment = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Payment Page</h1>
      <form className="max-w-md mx-auto bg-white p-4 shadow-md rounded">
        <label className="block mb-2">Card Number:</label>
        <input type="text" className="border p-2 w-full mb-4" placeholder="1234 5678 9101 1121" />

        <label className="block mb-2">Expiry Date:</label>
        <input type="text" className="border p-2 w-full mb-4" placeholder="MM/YY" />

        <label className="block mb-2">CVV:</label>
        <input type="text" className="border p-2 w-full mb-4" placeholder="123" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;
