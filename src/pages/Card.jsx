import React, { useRef } from 'react';

const Card = ({showDonorModel, showPatientModel }) => {
  const chartRef = useRef(null);

  const scrollToChart = () => {
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='mt-6'>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Registered Candidates</h2>
          <button 
            onClick={scrollToChart}
            className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            view all
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Add Donor here</h2>
          <button
            onClick={showDonorModel}
            className="mt-3 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Register 
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">Add Patient here</h2>
          <button 
            onClick={showPatientModel}
            className="mt-3 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Register 
          </button>
        </div>
      </div>
      {/* Hidden ref for scrolling */}
      <div ref={chartRef} />
    </div>
  );
};

export default Card;
