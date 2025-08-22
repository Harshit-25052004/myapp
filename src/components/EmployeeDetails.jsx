import React, { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  Settings,
  X,
  Loader2,
} from "lucide-react";
import "./EmployeeDetails.css";

const EmployeeDetailsModal = ({onClose, employeeId }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeData = async (employeeId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5001/api/employees/${employeeId}`);
      if (!res.ok) throw new Error("Failed to fetch employee details");
      const employee = await res.json();

      // Map backend fields to frontend
      setEmployeeData({
        id: employee.userid,
        name: employee.name,
        aadharNumber: employee.aadhar_number,
        accountNumber: employee.account_number,
        reraNumber: employee.rera_number,
        totalSales: employee.total_sales,
        superiorName: employee.superior_name,
        photoUrl: employee.photo_url,
        joinDate: employee.join_date || new Date().toISOString(),
        status: employee.status || "Active",
        ongoingWork: employee.ongoing_work || [],
        performance: employee.performance || null,
        department: employee.department || "N/A",
        email: employee.email || null,
      });
    } catch (err) {
      console.error("Error fetching employee data:", err);
      setError(err.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ( employeeId) {
      console.log("Fetching employee:", employeeId);
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {loading ? (
          <div className="loading">
            <Loader2 className="spin" size={32} /> Loading employee details...
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : employeeData ? (
          <div className="employee-details">
            <div className="employee-header">
              <img
                src={employeeData.photoUrl || "/default-avatar.png"}
                alt={employeeData.name}
                className="employee-photo"
              />
              <h2>{employeeData.name}</h2>
              <p>{employeeData.department}</p>
            </div>

            <div className="employee-info">
              <p><strong>User ID:</strong> {employeeData.id}</p>
              <p><strong>Email:</strong> {employeeData.email || "N/A"}</p>
              <p><strong>Aadhar No:</strong> {employeeData.aadharNumber}</p>
              <p><strong>Account No:</strong> {employeeData.accountNumber}</p>
              <p><strong>RERA No:</strong> {employeeData.reraNumber}</p>
              <p><strong>Join Date:</strong> {new Date(employeeData.joinDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {employeeData.status}</p>
              <p><strong>Total Sales:</strong> {employeeData.totalSales}</p>
              <p><strong>Superior:</strong> {employeeData.superiorName}</p>
            </div>

            <div className="employee-extra">
              <h3>Ongoing Work</h3>
              {employeeData.ongoingWork.length > 0 ? (
                <ul>
                  {employeeData.ongoingWork.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              ) : (
                <p>No ongoing work assigned.</p>
              )}
            </div>

            {employeeData.performance && (
              <div className="employee-performance">
                <h3>Performance</h3>
                <p>{employeeData.performance}</p>
              </div>
            )}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
