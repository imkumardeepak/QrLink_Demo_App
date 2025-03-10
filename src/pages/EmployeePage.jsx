import React, { useState } from "react";
import { nanoid } from "nanoid";
import employeesData from "../mocks/employees";
import { FaEdit, FaTrash, FaQrcode } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeePage = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;
    const newEmp = { id: nanoid(), ...newEmployee };
    setEmployees([...employees, newEmp]);
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      phone: "",
      salary: "",
    });
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirm) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const emp = employees.find((e) => e.id === id);
    setNewEmployee(emp);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    setEmployees(
      employees.map((emp) =>
        emp.id === editingId ? { ...emp, ...newEmployee } : emp
      )
    );
    setEditingId(null);
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      phone: "",
      salary: "",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Improved Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
          Manage Your Team
        </h2>
        <p className="text-gray-500">
          Add, edit, and manage employee information with ease.
        </p>
      </div>

      {/* Employee Form */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <form
          onSubmit={editingId ? handleUpdateEmployee : handleAddEmployee}
          className="p-4 md:p-6"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Employee" : "Add New Employee"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Responsive Grid for Form Fields */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEmployee.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newEmployee.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={newEmployee.department}
                onChange={handleChange}
                placeholder="Enter department"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={newEmployee.position}
                onChange={handleChange}
                placeholder="Enter position"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={newEmployee.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="salary"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Salary
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={newEmployee.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingId ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {" "}
          {/* Add horizontal scrolling */}
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-3 md:px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.id}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.name}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.email}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.department}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.position}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    {emp.phone}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    ₹{emp.salary.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-5 py-3 border-b border-gray-200 text-sm">
                    <div className="flex items-center justify-start space-x-2">
                      {" "}
                      {/* Reduced space-x */}
                      <button
                        onClick={() => handleEdit(emp.id)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash size={20} />
                      </button>
                      <Link
                        to={`/employee/${emp.id}`}
                        className="text-green-500 hover:text-green-700"
                        title="Generate QR Code"
                      >
                        <FaQrcode size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-4 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
