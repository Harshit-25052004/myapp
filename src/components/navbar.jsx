import { useState, useEffect } from 'react';
import {
  User,
  Menu,
  X,
  LogOut,
  UserCheck,
  Briefcase,
  Settings,
  ChevronDown
} from 'lucide-react';
import './Navbar.css';
import MenuComponent from './Menu';
import EmployeeDetailsModal from './EmployeeDetails'; 
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isPropertyDetailPage = location.pathname.startsWith('/property/');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    if (!isPropertyDetailPage) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPropertyDetailPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleDisplayDetails = () => {
    setShowEmployeeDetailsModal(true);
    setShowUserMenu(false);
  };

  const handleOngoingWork = () => {
    alert(
      `Ongoing Work:\n\n• Property Sale - Villa Project\n• Client Meeting - Apartment Complex\n• Documentation Review\n• Site Visit - Heritage Homes`
    );
    setShowUserMenu(false);
  };

  const handleUpdate = () => {
    alert(
      `Update Options:\n\n• Update Profile Information\n• Change Password\n• Update Contact Details\n• Notification Preferences`
    );
    setShowUserMenu(false);
  };

  const navStyleClass = isPropertyDetailPage ? 'scrolled' : isScrolled ? 'scrolled' : 'transparent';
  const textColorClass = isPropertyDetailPage ? 'dark' : isScrolled ? 'dark' : 'white';

  return (
    <>
      <nav className={`navbar ${navStyleClass}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <h1 className={textColorClass}>
                Haveli<span>Housing</span>
              </h1>
            </div>

            <div className="navbar-desktop">
              <Link to="/list-property" className={`navbar-button ${textColorClass}`}>
                LIST OF PROPERTY
              </Link>

              <button className={`navbar-button ${textColorClass}`} onClick={toggleMenu}>
                {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
              </button>

              {isAuthenticated ? (
                <div className="user-menu-container">
                  <button
                    className={`user-button ${textColorClass} ${showUserMenu ? 'active' : ''}`}
                    onClick={toggleUserMenu}
                  >
                    <User className="login-icon" />
                    {user?.name}
                    <ChevronDown
                      className={`dropdown-arrow ${showUserMenu ? 'rotated' : ''}`}
                      size={16}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown light-dropdown">
                      <div className="dropdown-header">
                        <div className="user-avatar">
                          <User size={20} />
                        </div>
                        <div className="user-info">
                          <span className="user-name">{user?.name}</span>
                          <span className="user-role">Employee</span>
                        </div>
                      </div>

                      <div className="dropdown-separator"></div>

                      <button className="user-dropdown-item" onClick={handleDisplayDetails}>
                        <UserCheck size={16} />
                        <span>Details</span>
                      </button>

                      <button className="user-dropdown-item" onClick={handleOngoingWork}>
                        <Briefcase size={16} />
                        <span>Ongoing Work</span>
                      </button>

                      <button className="user-dropdown-item" onClick={handleUpdate}>
                        <Settings size={16} />
                        <span>Update</span>
                      </button>

                      <div className="dropdown-separator"></div>

                      <button className="user-dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={`login-button ${textColorClass}`}>
                  <User className="login-icon" />
                  Login
                </Link>
              )}
            </div>

            <div className="navbar-mobile">
              <button className={`navbar-button ${textColorClass}`} onClick={toggleMenu}>
                {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
              </button>
            </div>
          </div>
        </div>

        <MenuComponent isOpen={isMenuOpen} onClose={toggleMenu} />
      </nav>

      {showEmployeeDetailsModal && (
        <EmployeeDetailsModal
          employeeId={user?._id} // ✅ fallback in case backend uses `id`
          onClose={() => setShowEmployeeDetailsModal(false)} // ✅ fixed close
        />
      )}
    </>
  );
}
