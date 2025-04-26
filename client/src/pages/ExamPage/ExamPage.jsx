import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamPage.css';

export const ExamPage = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [tests, setTests] = useState([
    { id: 1, name: 'FINAL TEST' },
    { id: 2, name: 'MINI TEST 2' },
    { id: 3, name: 'MINI TEST 1' },
    { id: 4, name: 'TEST RESULTS' }
  ]);

  useEffect(() => {
    try {
      const accountData = JSON.parse(localStorage.getItem('account') || '{}');
      if (accountData && accountData.name) {
        setStudentName(accountData.name);
      }
      
      if (accountData && accountData.class) {
        setClassName(accountData.class);
      } else {
        setClassName('A2.2');
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }, []);

  const handleTestClick = (testId, testName) => {
    console.log(`Navigating to test ${testId}: ${testName}`);
    
    if (testName === 'TEST RESULTS') {
      navigate('/test-results');
    } else {
      navigate(`/take-test/${testId}`);
    }
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div className="list-exam-container">
      <div className="exam-content">
        <div className="project-info">
          <div className="text-center mb-4">
            <img src="/image/logo.svg" alt="Project X Logo" className="mx-auto w-full h-auto" />
            <p className="text-white mb-8">take tests your way</p>
          </div>
          
          <div className="student-info">
            <p className="class-info">CLASS: {className}</p>
            <p className="student-name">Student's name: {studentName}</p>
          </div>
        </div>
        
        <div className="tests-list">
          {tests.map((test) => (
            <button
              key={test.id}
              className="test-button"
              onClick={() => handleTestClick(test.id, test.name)}
            >
              {test.name}
            </button>
          ))}
        </div>
        
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ExamPage;