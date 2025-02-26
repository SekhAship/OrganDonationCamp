import React, { useState, useEffect } from "react";
import { Button, Table, Modal, message } from "antd";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { fireDB } from "../../firebase";

const TransplantMatch = () => {
    const [donors, setDonors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [matches, setMatches] = useState([]);
    const [donationHistory, setDonationHistory] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const donorRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donors");
                const patientRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/patients");
                const donationRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donations");

                const [donorSnapshot, patientSnapshot, donationSnapshot] = await Promise.all([
                    getDocs(donorRef),
                    getDocs(patientRef),
                    getDocs(donationRef),
                ]);

                const donorData = donorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const patientData = patientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const donationData = donationSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDonors(donorData);
                setPatients(patientData);
                setDonationHistory(donationData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const findMatches = () => {
        const matchedPairs = [];
        patients.forEach((patient) => {
            const donorMatch = donors.find(
                (donor) => donor.organ === patient.organ && donor.bloodType === patient.bloodType
            );
            if (donorMatch) {
                matchedPairs.push({ patient, donor: donorMatch });
            }
        });
        setMatches(matchedPairs);
        setModalVisible(true);
    };

    const handleDonate = async (record) => {
        try {
            const donationData = {
                patientName: record.patient.name,
                patientID: record.patient.id,
                patientOrgan: record.patient.organ,
                donorName: record.donor.name,
                donorID: record.donor.id,
                donorOrgan: record.donor.organ,
                donationDate: new Date().toISOString(),
            };

            await addDoc(collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donations"), donationData);

            // Update donation history to disable button dynamically
            setDonationHistory((prev) => [...prev, donationData]);

            message.success("Donation recorded successfully!");
        } catch (error) {
            console.error("Error saving donation:", error);
            message.error("Failed to record donation.");
        }
    };

    const columns = [
        { title: "Patient Name", dataIndex: ["patient", "name"], key: "patientName" },
        { title: "Patient Organ", dataIndex: ["patient", "organ"], key: "patientOrgan" },
        { title: "Patient ID", dataIndex: ["patient", "id"], key: "patientID" },
        { title: "⇄", key: "arrow", render: () => "⇄" },
        { title: "Donor ID", dataIndex: ["donor", "id"], key: "donorID" },
        { title: "Donor Organ", dataIndex: ["donor", "organ"], key: "donorOrgan" },
        { title: "Donor Name", dataIndex: ["donor", "name"], key: "donorName" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                const isDonated = donationHistory.some(
                    (donation) =>
                        donation.patientID === record.patient.id &&
                        donation.donorID === record.donor.id
                );

                return (
                    <Button
                        type="primary"
                        onClick={() => handleDonate(record)}
                        disabled={isDonated}
                    >
                        {isDonated ? "Donated" : "Donate"}
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-center items-center h-screen">
                <Button
                    type="primary"
                    onClick={findMatches}
                    className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                    🔬 Transplant Match
                </Button>
            </div>

            <Modal
                title="Matched Registered Patients"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">Patient List</h3>
                    <h3 className="text-lg font-semibold">Donor List</h3>
                </div>
                <Table dataSource={matches} columns={columns} pagination={false} rowKey={(record) => record.patient.id} />
            </Modal>
        </div>
    );
};

export default TransplantMatch;
