import React, { useEffect } from 'react';
import './HomePage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
    });
  }, []);

  return (
    <div className="homepage-container">
      <div className="content-wrapper">
        <h1 
          className="main-title"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          This is homepage
        </h1>
        <div 
          className="animated-circle"
          data-aos="zoom-in"
          data-aos-delay="600"
        ></div>
        <div 
          className="animated-square" 
          data-aos="flip-left"
          data-aos-delay="1000"
        ></div>
      </div>
    </div>
  );
};

export default HomePage;