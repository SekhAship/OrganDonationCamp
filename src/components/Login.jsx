import React from "react";

const Login = (props) => {
  return (
    <div className=" mt-3 ">
      <div className="bg-white shadow-lg rounded-2xl p-5 w-90 text-center border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🔗 Connect Your Wallet</h2>
        <p className="text-gray-500 mb-6">Securely connect your wallet to proceed with transactions.</p>
        <button
          className=" py-3 px-6 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:scale-105 transition-all duration-300"
          onClick={props.connectWallet}
        >
          🚀 Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
