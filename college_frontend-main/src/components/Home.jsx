import home_image from "./images/home_image.png"
import "./Home.css";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Iitkimage from './images/IITK.jpg';
import IitBimage from './images/IITB.jpg';
import IitDimage from './images/IITD.jpg';
import IitMimage from './images/IITM.jpg';
import IitKGPimage from './images/IITKGP.jpg';
import IitGimage from './images/IITG.jpg';
import IitRoorkeeimage from './images/IITR.jpg';


function Home () {
    
    return (
        <div className="home">
            <div className="up">
                <div className="home-main-text">
                    <h1>College Path Finder</h1>
                    <p className="welcome">Connect To Success</p>
                    <p className="home-tag-line">Empowering Students to Find Their Perfect Path</p>
                </div>
                <div className="image-container">
                    <img src={home_image} className="home_img" alt="" />
                </div>
            </div>
            <News/>
            <TopColleges/>
            <Footer/>
        </div>
    );
}

function News(){
    return(
    <div className="news-container">
        <div class="news-summaries">
            <div class="tab-header">
                <h2>Latest News</h2>
            </div>
            <div class="tab-content">
                <div class="news-item">
                    <h3><a href="https://www.india.com/education/jee-main-2024-session-2-registration-closes-today-at-1030-pm-top-50-engineering-colleges-list-here-6762323/">JEE Main 2024 Session 2 Registration Closes Today At 10:30 PM; List Of Top 50 Engineering Colleges Here</a></h3>
                    <p>JEE Main 2024 Session 2 registration window will close today, March 4 at 10:30 PM. The candidates are allowed to make the corrections, latest by 7 March 2024 (up to 11:50 PM.)</p>
                </div>
                <div class="news-item">
                    <h3><a href="https://www.hindustantimes.com/education/competitive-exams/jee-main-2024-results-23-students-scored-100-nta-score-in-session-1-101707803882984.html">JEE Main 2024 Results: 23 students scored 100 NTA score in session 1</a></h3>
                    <p>The first exam session was conducted between January 24 and February 1. The second is scheduled between April 4 and April 15.</p>
                </div>
                <div class="news-item">
                    <h3><a href="https://news.careers360.com/iit-delhi-indian-institute-of-technology-abu-dhabi-admission-jee-main-advanced-jhajjar-director-new-courses">IIT Delhi Abu Dhabi admission for India students likely through JEE: Director</a></h3>
                    <p>IIT Delhi Abu Dhabi campus is set to open in 2024. In an interview, director Rangan Banerjee said the JEE Board is yet to approve the proposal.</p>
                </div>
                <div class="news-item">
                    <h3><a href="https://www.indiatoday.in/education-today/news/story/delhis-madhav-bansal-gets-perfect-100-percentile-in-jee-main-2024-aspires-to-join-iit-bombay-2510390-2024-03-05">Delhi’s Madhav Bansal achieves 100 percentile in JEE Main, targets IIT Bombay</a></h3>
                    <p>Meet Madhav Bansal from Delhi, who has achieved 100 percentile in the JEE Main. With his sights set on IIT Bombay, his exceptional achievement showcases his dedication and academic prowess.</p>
                </div>
            </div>
        </div>
    </div>
    );
}

function TopColleges() {
    const [slidesToShow, setSlidesToShow] = useState(3); 
    
    const data = {
        "slides": [
          {
            "src": IitBimage,
            "alt": "Image 1 for carousel",
            "text": "IIT Bombay"
          },
          {
            "src": IitMimage,
            "alt": "Image 2 for carousel",
            "text": "IIT Madras"
          },
          {
            "src": Iitkimage,
            "alt": "Image 3 for carousel",
            "text": "IIT Kanpur"
          },
          {
            "src": IitGimage,
            "alt": "Image 4 for carousel",
            "text": "IIT Guwhati"
          },
          {
            "src":IitKGPimage,
            "alt": "Image 5 for carousel",
            "text": "IIT Kharagpur"
          },
          {
            "src": IitRoorkeeimage,
            "alt": "Image 6 for carousel",
            "text": "IIT Roorkee"
          },
          {
            "src": IitDimage,
            "alt": "Image 7 for carousel",
            "text": "IIT Delhi"
          }
        ]
    };


    const [slide, setSlide] = useState(0);

    const nextSlide = () => {
        let nextIndex = (slide + 1) % data.slides.length;
        setSlide(nextIndex);
    };
    
    const prevSlide = () => {
        let prevIndex = (slide - 1 + data.slides.length) % data.slides.length;
        setSlide(prevIndex);
    };

    const getSlideIndex = (index) => {
        return (index + data.slides.length) % data.slides.length;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // Rotate every 3 second

        return () => clearInterval(interval);
    }, [slide]);

    return (
        <>
        <div className="top-colleges">
            <div >
                <p className="top-colleges-text">TO <span>P COLL</span>EGES</p>
            </div>
            <div className="top-colleges-carousel">
                <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
                {Array.from({ length: slidesToShow }).map((_, idx) => {
                    const slideIndex = getSlideIndex(slide + idx);
                    return (
                        <div key={idx} className="slide-wrapper">
                            <img
                                src={data.slides[slideIndex].src}
                                alt={data.slides[slideIndex].alt}
                                className="slide"
                                style={{ width: '400px', height: '300px' }}
                            />
                            <div className="text-overlay">{data.slides[slideIndex].text}</div>
                        </div>
                    );
                })}
                <BsArrowRightCircleFill onClick={nextSlide} className="arrow arrow-right" />
            </div>
        </div>
        </>
    );
}


function Footer() {
    const history = useHistory();

    const handleProfileClick = () => {
    // Navigate to the same location
    history.push('/users/profile');
    // Reload the page
};

    return (
        <div className="container-footer" style={{ backgroundColor: 'black' }}>
            <div className="row">
                <div className="footer-col">
                    <h4>COLLEGE</h4>
                    <ul>
                        <li><Link to="/users/search">IITs</Link></li>
                        <li><Link to="/users/search">NITs</Link></li>
                        <li><Link to="/users/search">Other Colleges</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>EXAMS</h4>
                    <ul>
                        <li><a href="https://jeemain.nta.ac.in/">JEE Mains</a></li>
                        <li><a href="https://www.jeeadv.ac.in/">JEE Advanced</a></li>
                        <li><a href="https://www.bitsadmission.com/bitsatmain.aspx">BITSAT</a></li>
                        <li><Link to="/not-found">Others</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>TOOLS</h4>
                    <ul>
                        <li><Link to="/me" onClick={handleProfileClick}>Profile</Link></li>
                        <li><Link to="/users/search">College Search</Link></li>
                        <li><Link to="/users/compare">College Compare</Link></li>
                        <li><Link to="/users/collegepredictor">College Predictor</Link></li>
                        <li><Link to="/dashboard">Forums</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>follow us</h4>
                    <div className="social-links">
                        <Link to="/not-found" className="fab fa-facebook-f"><FaFacebook /></Link>
                        <Link to="/not-found" className="fab fa-twitter"><FaTwitter /></Link>
                        <Link to="/not-found" className="fab fa-instagram"><FaInstagram /></Link>
                        <Link to="/not-found" className="fab fa-linkedin-in"><FaLinkedinIn /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
