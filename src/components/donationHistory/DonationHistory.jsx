import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase";

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            const donationRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donations");
            const donationSnapshot = await getDocs(donationRef);
            const donationData = donationSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setDonations(donationData);
        };
        fetchDonations();
    }, []);

    const columns = [
        { title: "Patient Name", dataIndex: "patientName", key: "patientName" },
        { title: "Patient Organ", dataIndex: "patientOrgan", key: "patientOrgan" },
        { title: "Donor Name", dataIndex: "donorName", key: "donorName" },
        { title: "Donor Organ", dataIndex: "donorOrgan", key: "donorOrgan" },
        {
            title: "Details",
            key: "details",
            render: (_, record) => (
                <button className="text-blue-500 underline" onClick={() => { setSelectedRecord(record); setDetailModalVisible(true); }}>
                    View Details
                </button>
            ),
        },
    ];

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">Donation History</h2>
            <Table dataSource={donations} columns={columns} rowKey="id" />
            <Modal title="Donation Details" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null}>
                {selectedRecord && (
                    <div>
                        <p><strong>Patient ID:</strong> {selectedRecord.patientID}</p>
                        <p><strong>Patient Name:</strong> {selectedRecord.patientName}</p>
                        <p><strong>Patient Organ:</strong> {selectedRecord.patientOrgan}</p>
                        <p><strong>Donor ID:</strong> {selectedRecord.donorID}</p>
                        <p><strong>Donor Name:</strong> {selectedRecord.donorName}</p>
                        <p><strong>Donor Organ:</strong> {selectedRecord.donorOrgan}</p>
                        <p><strong>Donation Date:</strong> {selectedRecord.donationDate}</p>

                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DonationHistory;
