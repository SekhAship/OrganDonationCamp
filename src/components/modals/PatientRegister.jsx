import React from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { fireDB } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
// import { db, collection, addDoc } from "../firebaseConfig";


function PatientRegisterModal({ isPatientModelVisible, handlepatientCancel }) {
  const [form] = Form.useForm(); // ✅ Create form instance

  const onFinish = async (values) => {
    try {
      const newpatient = {
        name: values.name,
        age: Number(values.age),
        gender: values.gender,
        bloodType: values.bloodType,
        organ: values.organ,
        height: Number(values.height),
        weight: Number(values.weight),
        registeredAt: new Date().toISOString(),
      };

      await addDoc(collection(fireDB, "hospital/J1mvbTqe81NV60tTKYoT/patients"), newpatient);
      message.success("Patient Registered Successfully!");
      toast.success("Patient Registered Successfully!"); // ✅ Add toast notification
      
      form.resetFields(); // ✅ Reset form after successful submission
      handlepatientCancel();
    } catch (error) {
      console.error("Error adding Patient:", error);
      message.error("Failed to register Patient. Try again.");
    }
  };

  return (
    <Modal title="patient Registration" open={isPatientModelVisible} onCancel={handlepatientCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}> {/* ✅ `form` prop added */}
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter full name" />
        </Form.Item>
        <Form.Item label="Age" name="age" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter age" />
        </Form.Item>
        <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Blood Type" name="bloodType" rules={[{ required: true }]}>
          <Select placeholder="Select blood type">
            <Select.Option value="A+">A+</Select.Option>
            <Select.Option value="A-">A-</Select.Option>
            <Select.Option value="B+">B+</Select.Option>
            <Select.Option value="B-">B-</Select.Option>
            <Select.Option value="O+">O+</Select.Option>
            <Select.Option value="O-">O-</Select.Option>
            <Select.Option value="AB+">AB+</Select.Option>
            <Select.Option value="AB-">AB-</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Organ Needed" name="organ" rules={[{ required: true }]}>
          <Select placeholder="Select organ">
            <Select.Option value="kidney">Kidney</Select.Option>
            <Select.Option value="liver">Liver</Select.Option>
            <Select.Option value="heart">Heart</Select.Option>
            <Select.Option value="lungs">Lungs</Select.Option>
            <Select.Option value="pancreas">Pancreas</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Height (cm)" name="height" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter height in cm" />
        </Form.Item>
        <Form.Item label="Weight (kg)" name="weight" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter weight in kg" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Register as patient</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PatientRegisterModal;
