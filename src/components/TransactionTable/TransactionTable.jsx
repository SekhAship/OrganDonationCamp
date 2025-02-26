import { Table, Modal, Input, Button, message } from "antd";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase";
import { toast } from "react-hot-toast";
const TransactionTable = () => {
  const [search, setSearch] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donors");
        const patientRef = collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/patients");

        const donorSnapshot = await getDocs(donorRef);
        const patientSnapshot = await getDocs(patientRef);

        const donorData = donorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "Donor",
        }));

        const patientData = patientSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "Patient",
        }));

        setTransactions([...donorData, ...patientData]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        message.error("Error loading data");
      }
    };

    fetchData();
  }, []);

    // Open Edit Modal
    const handleEditClick = (transaction) => {
      if (!transaction || !transaction.id) return;
      setSelectedTransaction(transaction);
      setEditedTransaction(transaction);
      setEditModalVisible(true);
    };
  
    // Handle Edit Change
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditedTransaction((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    // Save Edited Transaction to Firebase
    const handleSaveEdit = async () => {
      if (!selectedTransaction || !selectedTransaction.id) return;
  
      try {
        const docRef = doc(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/${selectedTransaction.type.toLowerCase()}s`, selectedTransaction.id);
        await updateDoc(docRef, editedTransaction);
  
        setTransactions((prev) =>
          prev.map((txn) =>
            txn.id === selectedTransaction.id ? { ...txn, ...editedTransaction } : txn
          )
        );
  
        toast.success("Updated successfully!");
        setEditModalVisible(false);
      } catch (error) {
        console.error("Error updating document:", error);
        message.error("Failed to update");
      }
    };

  const handleViewClick = (transaction) => {
    setSelectedTransaction(transaction);
    setViewModalVisible(true);
  };

  const handleDeleteClick = async (id, type) => {
    try {
      await deleteDoc(doc(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/${type.toLowerCase()}s`, id));
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
      message.success("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Failed to delete");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", responsive: ["md"] },
    { title: "Blood Type", dataIndex: "bloodType", key: "bloodType" },
    { title: "Organ", dataIndex: "organ", key: "organ" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <button onClick={() => handleViewClick(record)} className="bg-green-500 text-white px-2 py-1 rounded">View More</button>
          <button onClick={() => handleEditClick(record)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
          <button onClick={() => handleDeleteClick(record.id, record.type)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      ),
    },
  ];

  const filterTransactions = transactions.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 mt-6">📊 Donors & Patients</h2>
      <div className="relative mt-5 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 shadow-sm outline-none"
        />
      </div>
      <Table
        className="mt-6"
        dataSource={filterTransactions}
        columns={columns}
        pagination={{ pageSize: 6 }}
        scroll={{ x: "max-content" }}
      />

      {/* View More Modal */}
      <Modal
        title="Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedTransaction && (
          <div className="flex flex-col space-y-2">
            {Object.entries(selectedTransaction).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}
      </Modal>
      {/* Edit Modal */}
      <Modal
        title="Edit Entry"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveEdit}
      >
        <div className="flex flex-col space-y-3">
          <Input name="name" value={editedTransaction.name} onChange={handleEditChange} placeholder="Name" />
          <Input name="age" value={editedTransaction.age} onChange={handleEditChange} placeholder="Age" type="number" />
          <Input name="bloodType" value={editedTransaction.bloodType} onChange={handleEditChange} placeholder="Blood Type" />
          <Input name="organ" value={editedTransaction.organ} onChange={handleEditChange} placeholder="Organ" />
          <Input name="height" value={editedTransaction.height} onChange={handleEditChange} placeholder="Height (cm)" type="number" />
          <Input name="weight" value={editedTransaction.weight} onChange={handleEditChange} placeholder="Weight (kg)" type="number" />
        </div>
      </Modal>
    </div>
  );
};

export default TransactionTable;