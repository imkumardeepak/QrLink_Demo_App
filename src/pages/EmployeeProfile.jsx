import React from "react";
import { useParams, Link } from "react-router-dom";
import employeesData from "../mocks/employees";
import {
  FaEnvelope,
  FaBriefcase,
  FaUser,
  FaPhone,
  FaRupeeSign,
  FaArrowLeft,
} from "react-icons/fa"; // Import React Icons

const EmployeeProfile = () => {
  const { id } = useParams();
  const employee = employeesData.find((emp) => String(emp.id) === String(id));

  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-500">
            Employee not found!
          </h2>
          <Link
            to="/"
            className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center mb-4 border-b pb-4">
          <FaUser className="h-12 w-12 text-gray-700 mr-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            {employee.name}&apos;s Profile
          </h2>
        </div>

        <ul>
          <li className="flex items-center mb-2">
            <FaEnvelope className="mr-2 text-gray-600" />
            <span className="font-semibold">Email:</span> {employee.email}
          </li>
          <li className="flex items-center mb-2">
            <FaBriefcase className="mr-2 text-gray-600" />
            <span className="font-semibold">Department:</span>{" "}
            {employee.department}
          </li>
          <li className="flex items-center mb-2">
            <FaBriefcase className="mr-2 text-gray-600" />
            <span className="font-semibold">Position:</span> {employee.position}
          </li>
          <li className="flex items-center mb-2">
            <FaPhone className="mr-2 text-gray-600" />
            <span className="font-semibold">Phone:</span> {employee.phone}
          </li>
          <li className="flex items-center mb-2">
            <FaRupeeSign className="mr-2 text-gray-600" />
            <span className="font-semibold">Salary:</span> ₹
            {employee.salary.toLocaleString()}
          </li>
        </ul>
        {/* <Link
          to="/"
          className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaArrowLeft className="inline-block mr-2" /> Back to List
        </Link> */}
      </div>
    </div>
  );
};

export default EmployeeProfile;
