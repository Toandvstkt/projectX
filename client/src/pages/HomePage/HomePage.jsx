import React, { useEffect, useState } from 'react';
import './HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
    });

    try {
      const account = JSON.parse(localStorage.getItem('account') || '{}');
      if (account && account.role) {
        setUserRole(account.role);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  const handleViewTests = () => {
    navigate('/exams');
  };

  const handleMyClasses = () => {
    navigate('/my-classes');
  };

  const handleCreateTests = () => {
    navigate('/create-tests');
  };

  const handleLogout = () => {
    localStorage.removeItem('account');
    localStorage.removeItem('token');
    navigate('/login');
  };

  console.log("Current userRole state:", userRole);

  const isTeacher = userRole === 'Giáo viên';
  console.log("isTeacher:", isTeacher);

  return (
    <div className="homepage-container">
      <div className="content-wrapper" data-aos="fade-up" data-aos-delay="200">
        {!isTeacher && <p className="welcome-text">Welcome to</p>}

        <div className="text-center mb-4">
          <img src="/image/logo.svg" alt="Project X Logo" className="mx-auto w-full h-auto" />
          <p className="text-white mb-8">take tests your way</p>
        </div>

        {isTeacher ? (
          <div className="admin-buttons">
            <button
              className="admin-button"
              onClick={handleMyClasses}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              MY CLASSES
            </button>

            <button
              className="admin-button"
              onClick={handleCreateTests}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              CREATE NEW TESTS
            </button>
          </div>
        ) : (
          <button
            className="view-tests-btn"
            data-aos="zoom-in"
            data-aos-delay="400"
            onClick={handleViewTests}
          >
            View my tests
          </button>
        )}

        <div className="logout-link" onClick={handleLogout}>
          Log out
        </div>
      </div>
    </div>
  );
};

export default HomePage;