import Navbar from "../components/headers/Navbar";

import { useEffect, useState } from "react";
import { Form, Modal } from 'antd';
import toast from "react-hot-toast";
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { fireDB } from "../firebase";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import Card from "./Card";
import DonorRegisterModal from "../components/modals/DonorRegister";
import PatientRegisterModal from "../components/modals/PatientRegister";
import { message } from "antd";
import TransplantMatch from "../components/matchBox/TransplantMatch";
import {ethers} from 'ethers';
import { contractAddress, contactAbi } from '../constants/Constant';
import Connected from "../components/Connected";
import Login from "../components/Login";


export default function Dashboard() {
  //contractcode starts
  const [account, setAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [votingStatus, setVotingStatus] = useState(true)
  const [remainingTime, setRemainingTime] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [number, setNumber] = useState('')
  const [CanVote, setCanVote] = useState(true)


  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('accountsChanged', handleAcountsChanged);
    }
    return () => {
      if(window.ethereum) {
        window.ethereum.off('accountsChanged', handleAcountsChanged);
      }
    }
  }
  );

  function handleAcountsChanged(accounts) {
    if(accounts.length > 0&&accounts!==accounts[0]) {

      setAccount(accounts[0]);
      canVote();
    }else {
      setAccount(null);
      setIsConnected(false);
    }
  }



  async function connectWallet() {
    if(window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);

        const signer = await provider.getSigner();
        const address = await signer.getAddress();
       
        setAccount(address);
        console.log("Metamask connected ",address);
        setIsConnected(true);
      } catch (error) {
        console.log(error)  
      }
    }
    else {
      alert('Please install MetaMask!')
    }
  }

  //contractcode ends

  const [donors,setDonors] = useState([]);
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDonorModelVisible, setIsDonorModelVisible] = useState(false);
  const [isPatientModelVisible, setIsPatientModelVisible] = useState(false);

  const showDonorModel = () => setIsDonorModelVisible(true);
  const showPatientModel = () => setIsPatientModelVisible(true);
  const handleDonorCancel = () => setIsDonorModelVisible(false);
  const handlepatientCancel = () => setIsPatientModelVisible(false);

  // Handle Delete Transaction
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/donors`, id));
      setTransactions((prevTransactions) => prevTransactions.filter((txn) => txn.id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Error deleting transaction.");
      console.error("Error deleting document: ", error);
    }
  };

  // Handle Edit Transaction
  const handleEdit = async (id, editedTransaction) => {
    try {
      const transactionRef = doc(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/donors`, id);
      const updatedTransaction = { ...editedTransaction, amount: Number(editedTransaction.amount) };
      await updateDoc(transactionRef, updatedTransaction);
      setTransactions((prevTransactions) =>
        prevTransactions.map((txn) => (txn.id === id ? { ...txn, ...updatedTransaction } : txn))
      );
      toast.success("Transaction updated successfully!");
    } catch (error) {
      toast.error("Error updating transaction.");
      console.error("Error updating document: ", error);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);


  // Fetch Transactions from Firebase
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = collection(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/donors`);
      const snapshot = await getDocs(data);
      let transactionsArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      toast.error("Failed to load transactions.");
      setLoading(false);
    }
  };

//onfinish donor


const onFinishD = async (values) => {
  try {
    const newDonor = {
      name: values.name,
      age: Number(values.age),
      gender: values.gender,
      bloodType: values.bloodType,
      organ: values.organ,
      height: Number(values.height),
      weight: Number(values.weight),
      registeredAt: new Date().toISOString(), // Timestamp for record-keeping
    };

    // Add donor to Firestore inside the 'hospital' collection
    const docRef = await addDoc(collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/donors"), newDonor);

    message.success("Donor Registered Successfully!");
    
    // Update local state (if applicable)
    setDonors((prevDonors) => [...prevDonors, newDonor]);

    form.resetFields();
    handleCancel();
  } catch (error) {
    console.error("Error adding donor:", error);
    message.error("Failed to register donor. Try again.");
  }
};
const onFinishP = async (values) => {
  try {
    const newDonor = {
      name: values.name,
      age: Number(values.age),
      gender: values.gender,
      bloodType: values.bloodType,
      organ: values.organ,
      height: Number(values.height),
      weight: Number(values.weight),
      registeredAt: new Date().toISOString(), // Timestamp for record-keeping
    };

    // Add donor to Firestore inside the 'hospital' collection
    const docRef = await addDoc(collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/patients"), newDonor);

    message.success("Donor Registered Successfully!");
    
    // Update local state (if applicable)
    setDonors((prevDonors) => [...prevDonors, newDonor]);

    form.resetFields();
    handleCancel();
  } catch (error) {
    console.error("Error adding donor:", error);
    message.error("Failed to register donor. Try again.");
  }
};


  async function addTransaction(transaction) {
    try {
      const formattedTransaction = { ...transaction, amount: Number(transaction.amount) };
      const docRef = await addDoc(collection(fireDB, `hospital/J1mvbTqe81NV60tTKYoT/donors`), formattedTransaction);
      toast.success("Transaction Added!");
      setTransactions((prevTransactions) => [...prevTransactions, formattedTransaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    }
  }


  return (
    <div className="max-w-[calc(100%-4cm)] mx-auto p-6">
      <div className="min-h-screen flex flex-col">
          {/* Main Content */}
          <Navbar/>
          {isConnected?(
                // <Connected account={account}
                // candidates={candidates}
                // remainingTime={remainingTime}
                // number={number}
                // handleNumberChange={handleNumberChange}
                // votefunction={vote}
                // CanVote={CanVote}
                // />
                <></>
                
              ):(
        
                <></>
              )}

            <>
              {loading?(<p>Loading...</p>):(
              <>
                <Card
                  showDonorModel={showDonorModel}
                  showPatientModel={showPatientModel}
                />
                <DonorRegisterModal
                form={form}
                isDonorModelVisible={isDonorModelVisible}
                handleDonorCancel={handleDonorCancel}
                onFinish={onFinishD}
                />
                <PatientRegisterModal
                isPatientModelVisible={isPatientModelVisible}
                handlepatientCancel={handlepatientCancel}
                onFinish={onFinishP}
                />
              </>)}
        
              <TransactionTable transactions={transactions} onDelete={handleDelete} onEdit={handleEdit} />
              <TransplantMatch/>
             

            </>
          
      </div>
    </div>
  );
}
