import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // Sort order: true = ascending, false = descending

  // Fetch employee data
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
          setFilteredEmployees(result.data.Result); // Initialize filtered employees
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle delete employee
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  // Handle search filter by employee name
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    const filtered = employee.filter((e) =>
      e.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // Handle sort toggle by salary
  const handleSortChange = (event) => {
    const sortChecked = event.target.checked;
    setSortAsc(sortChecked);

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      return sortChecked ? a.salary - b.salary : b.salary - a.salary;
    });
    setFilteredEmployees(sortedEmployees);
  };

  // Export to CSV
  const handleExport = () => {
    const csvContent = [
      ["Name", "Image", "Email", "Address", "Salary"].join(","),
      ...filteredEmployees.map((e) =>
        [e.name, e.image, e.email, e.address, e.salary].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employee_list.csv";
    link.click();
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee List</h3>
        {/* Export Button - Adjusted Position */}
        <button
          className="btn btn-primary"
          onClick={handleExport}
          style={{ position: "absolute", right: "20px", top: "60px" }} // Adjusted top positioning
        >
          Export
        </button>
      </div>

      {/* Add Employee Button */}
      <div className="d-flex justify-content-end mb-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>

      <div className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          {/* Search Filter */}
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />

          {/* Checkbox for Sorting */}
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="sortSalary"
              checked={sortAsc}
              onChange={handleSortChange}
            />
            <label className="form-check-label" htmlFor="sortSalary">
              Sort by Salary (Ascending)
            </label>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3001/Images/` + e.image}
                    className="employee_image"
                    alt={e.name}
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
