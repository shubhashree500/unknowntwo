




import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

import axios from "axios";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

// Define the Employee interface
interface Employee {
  id: number;
  employee_name: string;
  position: string;
  assets: { name: string; issue_date: string }[]; 
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    employee_name: "",
    position: "",
    assets: [],
  });
  const [assetName, setAssetName] = useState(""); 
  const [assetDate, setAssetDate] = useState<any>(""); // Updated type

  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/employees/get"
        );
        console.log("response", response);

        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle input change for employee fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  // Handle adding assets to the employee
  const handleAddAsset = () => {
    if (assetName && assetDate) {
      setNewEmployee({
        ...newEmployee,
        assets: [...newEmployee.assets, { name: assetName, issue_date: assetDate.format('DD-MM-YYYY') }],
      });
      setAssetName(""); // Reset asset name input
      // setAssetDate(null); // Reset asset date input
    }
  };

  // Handle form submit to add or edit an employee
  const handleSaveEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditing && currentEmployeeId !== null) {
        // Update existing employee
        const response = await axios.put(
          `http://localhost:3002/api/employees/update/${currentEmployeeId}`,
          newEmployee
        );
        setEmployees(
          employees.map((emp) =>
            emp.id === currentEmployeeId ? response.data : emp
          )
        );
      } else {
        // Add new employee
        const response = await axios.post(
          "http://localhost:3002/api/employees/create",
          newEmployee
          
        );
        setEmployees([...employees, response.data]); 
      }
      
      // Reset the form fields and close the dialog
      setNewEmployee({
        id: 0,
        employee_name: "",
        position: "",
        assets: [],
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/editing employee:", error);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3002/api/employees/delete/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Handle edit employee
  const handleEditEmployee = (id: number) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    if (employeeToEdit) {
      setNewEmployee({
        ...employeeToEdit,
      });
      setIsEditing(true);
      setCurrentEmployeeId(id);
      setIsDialogOpen(true);
    }
  };

  // Toggle the dialog visibility
  const handleDialogOpen = () => {
    setIsEditing(false);
    setCurrentEmployeeId(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 overflow-hidden">
      <h1 className="text-3xl font-bold mb-5 text-center">Employee List</h1>

      {/* Employee List */}
      <div className="bg-white p-5 rounded-lg shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add New Employee
        </Button>
        <table className="table-auto w-full text-left mt-4">
          <thead>
            <tr className="bg-gray-200">
              {/* Table headers */}
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Assets</th>
              
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-2">{emp.id}</td>
                <td className="px-4 py-2">{emp.employee_name}</td>
                <td className="px-4 py-2">{emp.position}</td>
                <td className="px-4 py-2">
                  <ul>
                    {emp?.assets?.map((asset:any, index:number) => (
                      <li key={index}>
                        {asset?.name} - Issue Date: {asset?.issue_date}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditEmployee(emp.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add or Edit Employee Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        <form onSubmit={handleSaveEmployee}>
          <DialogContent>
            {/* Form fields here */}
            <TextField
              label="Name"
              name="employee_name"
              value={newEmployee.employee_name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Position"
              name="position"
              value={newEmployee.position}
              onChange={handleInputChange}
              fullWidth
              required
              margin="dense"
            />
            {/* Asset Input */}
            <TextField
              label="Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              fullWidth
              margin="dense"
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                type="date"
                label="Issue Date"
                inputFormat="DD-MM-YYYY"
                value={assetDate}
                onChange={(newValue) => setAssetDate(newValue)}
                renderInput={(params:any) => <TextField {...params} fullWidth margin="dense" />}
              />
            
            </LocalizationProvider> */}
            <TextField
            type="date"
            label="Issue Date"
            value={assetDate}
            onChange={(newValue) => setAssetDate(newValue)}
            />
            <Button onClick={handleAddAsset} color="primary">
              Add Asset
            </Button>
            <ul>
              {newEmployee.assets.map((asset, index) => (
                <li key={index}>
                  {asset.name} - Issue Date: {asset.issue_date}
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {isEditing ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EmployeeList;


