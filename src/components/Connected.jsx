import React, { useEffect, useState } from "react";

const Connected = ({ account, contract }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Ensure the contract is loaded and accessible
        if (!contract) {
          console.log("Contract not loaded.");
          return;
        }

        // Fetch the donations array from the contract
        const donationList = await contract.getDonations();
        const formattedDonations = donationList.map(donation => {
          // Ensure timestamp is a BigInt and convert to a readable date
          const timestamp = BigInt(donation.timestamp); // Ensure timestamp is BigInt
          const date = new Date(Number(timestamp) * 1000); // Convert BigInt to regular number and multiply by 1000 to get milliseconds
          
          return {
            patientId: donation.patientID,
            donorId: donation.donorID,
            organId: donation.organID,
            time: date.toLocaleString(), // Convert to local string format
          };
        });

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    if (contract) {
      fetchDonations();
    }
  }, [contract]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        Blockchain Stored Donations
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : donations.length === 0 ? (
        <p className="text-center text-red-500 font-semibold">No data found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Patient ID</th>
                <th className="py-2 px-4">Donor ID</th>
                <th className="py-2 px-4">Organ ID</th>
                <th className="py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 text-center">{donation.patientId}</td>
                  <td className="py-2 px-4 text-center">{donation.donorId}</td>
                  <td className="py-2 px-4 text-center">{donation.organId}</td>
                  <td className="py-2 px-4 text-center">{donation.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Connected;
