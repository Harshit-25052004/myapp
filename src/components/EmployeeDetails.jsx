import { useState, useEffect } from 'react';
import { X, User, Calendar, TrendingUp, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EmployeeDetails.css';

export default function EmployeeDetailsModal({ isOpen, onClose, employeeId }) {
  console.log("into employee details");
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [isOpen, employeeId]);

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/employees`);
      if (!res.ok) throw new Error('Failed to fetch employee details');
      const data = await res.json();

      setEmployeeData({
        id: data._id,
        name: data.name,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        reraNumber: data.rera_number,
        totalSales: data.total_sales,
        superiorName: data.superior_name,
        photoUrl: data.photo_url,
        joinDate: data.join_date || new Date().toISOString(),
        status: data.status || 'Active',
        ongoingWork: data.ongoing_work || [],
        performance: data.performance || null,
        department: data.department || 'N/A'
      });

    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError(err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#22c55e';
      case 'inactive': return '#ef4444';
      case 'on leave': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return '';
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push('★');
    if (hasHalfStar) stars.push('☆');
    return stars.join('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="employee-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <User size={24} />
            Employee Details
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {loading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Loading employee details...</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <p className="error-message">❌ {error}</p>
            <button onClick={() => fetchEmployeeData(employeeId)} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {employeeData && !loading && !error && (
          <div className="modal-content">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                {employeeData.photoUrl ? (
                  <img src={employeeData.photoUrl} alt={employeeData.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {employeeData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h3 className="employee-name">{employeeData.name}</h3>
                <p className="employee-title">{employeeData.department}</p>
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(employeeData.status) }}
                >
                  {employeeData.status}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              {/* Personal Info */}
              <div className="detail-section">
                <h4 className="section-title">
                  <User size={18} /> Personal Information
                </h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="detail-label">Employee ID:</span>
                    <span className="detail-value">{employeeData.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">RERA Number:</span>
                    <span className="detail-value">{employeeData.reraNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Aadhar Number:</span>
                    <span className="detail-value">{employeeData.aadharNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">{employeeData.accountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Work Info */}
              <div className="detail-section">
                <h4 className="section-title">
                  <Briefcase size={18} /> Work Information
                </h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="detail-label">Superior:</span>
                    <span className="detail-value">{employeeData.superiorName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Sales:</span>
                    <span className="detail-value highlight">{employeeData.totalSales}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Join Date:</span>
                    <span className="detail-value">{formatDate(employeeData.joinDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Active Tasks:</span>
                    <span className="detail-value">{employeeData.ongoingWork.length}</span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              {employeeData.performance && (
                <div className="detail-section performance-section">
                  <h4 className="section-title">
                    <TrendingUp size={18} /> Performance Metrics
                  </h4>
                  <div className="performance-grid">
                    <div className="performance-item">
                      <div className="performance-value">
                        {employeeData.performance.completionRate}%
                      </div>
                      <div className="performance-label">Completion Rate</div>
                    </div>
                    <div className="performance-item">
                      <div className="performance-value">
                        {getRatingStars(employeeData.performance.customerRating)} 
                        <span className="rating-number">
                          {employeeData.performance.customerRating}/5
                        </span>
                      </div>
                      <div className="performance-label">Customer Rating</div>
                    </div>
                    <div className="performance-item">
                      <div className="performance-value">
                        {employeeData.performance.monthlyAchieved}/{employeeData.performance.monthlyTarget}
                      </div>
                      <div className="performance-label">Monthly Target</div>
                    </div>
                    <div className="performance-item">
                      <div className="performance-value">
                        {employeeData.performance.ongoingProjects}
                      </div>
                      <div className="performance-label">Active Projects</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ongoing Work */}
              <div className="detail-section ongoing-work-section">
                <h4 className="section-title">
                  <Calendar size={18} /> Current Tasks
                </h4>
                {employeeData.ongoingWork.length > 0 ? (
                  <div className="work-list">
                    {employeeData.ongoingWork.map((work, index) => (
                      <div key={index} className="work-item">
                        <div className="work-bullet"></div>
                        <span className="work-text">
                          {typeof work === 'string' ? work : work.taskName || 'Untitled Task'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-work">No active tasks assigned</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-section">
              <h4 className="section-title">
                <Phone size={18} /> Contact Information
              </h4>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} /> <span>{user?.email || 'Not provided'}</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} /> <span>+91 98765 43210</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} /> <span>Mumbai, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
