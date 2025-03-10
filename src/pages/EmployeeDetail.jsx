import React from "react";
import { Link, useParams } from "react-router-dom";
import employeesData from "../mocks/employees";
import { QRCodeCanvas } from "qrcode.react";
import { FaArrowLeft } from "react-icons/fa";

const EmployeeDetail = () => {
  const { id } = useParams();
  const employee = employeesData.find((emp) => String(emp.id) === String(id));
  console.log(id);
  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-500">
            Employee not found!
          </h2>
        </div>
      </div>
    );
  }

  const baseUrl = `http://${window.location.hostname}:${window.location.port}`;
  const employeeUrl = `${baseUrl}/employee/qrcode/${employee.id}`;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">QR Code</h2>
        <div className="mx-auto mb-6 flex justify-center items-center">
          <QRCodeCanvas value={employeeUrl} size={256} level="H" />
        </div>

        <p className="text-lg text-gray-700 mt-4">
          Scan the QR code to view employee details.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaArrowLeft className="inline-block mr-2" /> Back to List
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDetail;
