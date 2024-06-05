import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CollegeCompare.css';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from "react-toastify";


const CollegeCompare = () => {
  const [college1, setCollege1] = useState('');
  const [college2, setCollege2] = useState('');
  const [branch1, setBranch1] = useState('');
  const [branch2, setBranch2] = useState('');
  const [collegeData, setCollegeData] = useState({});
  const [userOpinions, setUserOpinions] = useState({ user1: [], user2: [] });

  // Predefined options for colleges and branches
  const collegeOptions = [
    { label: 'IIT Kanpur', value: 'IIT Kanpur' },
    { label: 'IIT Bombay', value: 'IIT Bombay' },
    { label: 'IIT Delhi', value: 'IIT Delhi' },
    { label: 'IIT Madras', value: 'IIT Madras' },
    { label: 'IIT Kharagpur', value: 'IIT Kharagpur' },
    { label: 'IIT Roorkee', value: 'IIT Roorkee' },
    { label: 'IIT Guwahati', value: 'IIT Guwahati' },
    { label: 'IIT Hyderabad', value: 'IIT Hyderabad' },
    { label: 'IIT Gandhinagar', value: 'IIT Gandhinagar' },
    { label: 'IIT Ropar', value: 'IIT Ropar' },
    { label: 'IIT Bhubaneswar', value: 'IIT Bhubaneswar' },
    { label: 'IIT Indore', value: 'IIT Indore' },
    { label: 'IIT Patna', value: 'IIT Patna' },
    { label: 'IIT Mandi', value: 'IIT Mandi' },
    { label: 'IIT (BHU) Varanasi', value: 'IIT (BHU) Varanasi' },
    { label: 'IIT Palakkad', value: 'IIT Palakkad' },
    { label: 'IIT Tirupati', value: 'IIT Tirupati' },
    { label: 'IIT Dhanbad', value: 'IIT Dhanbad' },
    { label: 'IIT Bhilai', value: 'IIT Bhilai' },
    { label: 'IIT Goa', value: 'IIT Goa' },
    { label: 'IIT Jammu', value: 'IIT Jammu' },
    { label: 'IIT Dharwad', value: 'IIT Dharwad' },
  ];
  
  const branchOptions = [
    { label: 'CSE', value: 'CSE' },
    { label: 'EE', value: 'EE' },
    { label: 'ME', value: 'ME' },
    { label: 'BSBE', value: 'BSBE' },
    { label: 'MTH', value: 'MTH' },
    { label: 'PHY', value: 'PHY' },
    { label: 'CHM', value: 'CHM' },
    { label: 'CHE', value: 'CHE' },
    { label: 'AE', value: 'AE' },
    { label: 'MSE', value: 'MSE' },
  ];
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college1 || !college2 || !branch1 || !branch2) {
        toast.error("Please select all fields");
        return;
    }
    try {
        const collegeResponse = await axios.get('http://localhost:5000/users/compare', {
            params: { college1, college2 },
        });
        setCollegeData(collegeResponse.data);

        const userOpinionResponse = await axios.get('http://localhost:5000/users/opinion', {
            params: { college1, college2, branch1, branch2 },
        });

        setUserOpinions(userOpinionResponse.data);
    } catch (error) {
        console.error(error);
    }
};


  useEffect(() => {
      return () => {
          setCollegeData({});
          setUserOpinions({ user1: [], user2: [] });
      };
  }, []);

  const opinionTitles = ["Academic Opinion", "Non-Academic Opinion", "Placement Opinion", "Overall Opinion"];

  return (
      <div className="container-fluid" style={{ backgroundColor: '#3F5757', minHeight: '100vh' }}>
        <ToastContainer />
          <h2 className="mt-4 mb-4 text-white">College Comparison</h2>
          <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                  <div className="col-md-6">
                      <select
                          className="form-control"
                          value={college1}
                          onChange={(e) => setCollege1(e.target.value)}
                      >
                          <option value="">Select College 1</option>
                          {collegeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                      </select>
                      <select
                          className="form-control mt-3"
                          value={branch1}
                          onChange={(e) => setBranch1(e.target.value)}
                      >
                          <option value="">Select Branch 1</option>
                          {branchOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                      </select>
                  </div>
                  <div className="col-md-6">
                      <select
                          className="form-control"
                          value={college2}
                          onChange={(e) => setCollege2(e.target.value)}
                      >
                          <option value="">Select College 2</option>
                          {collegeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                      </select>
                      <select
                          className="form-control mt-3"
                          value={branch2}
                          onChange={(e) => setBranch2(e.target.value)}
                      >
                          <option value="">Select Branch 2</option>
                          {branchOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                      </select>
                  </div>
              </div>
                      <div className="text-center mt-3">
                          <button type="submit" className="btn btn-primary">Compare</button>
                      </div>
          </form>
        {collegeData.college1 && collegeData.college2 && (
          <div className="comparison-table">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>{collegeData.college1.name}</th>
                  <th>{collegeData.college2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> Location</td>
                  <td>{collegeData.college1.location}</td>
                  <td>{collegeData.college2.location}</td>
                </tr>
                <tr>
                  <td> Description</td>
                  <td><ReactMarkdown>{collegeData.college1.description}</ReactMarkdown></td>
                  <td><ReactMarkdown>{collegeData.college2.description}</ReactMarkdown></td>
                </tr>
                <tr>
                  <td>NIRF Ranking</td>
                  <td>{collegeData.college1.nirfRanking}</td>
                  <td>{collegeData.college2.nirfRanking}</td>
                </tr>
                <tr>
                  <td>Average Package</td>
                  <td>{collegeData.college1.placementStats}</td>
                  <td>{collegeData.college2.placementStats}</td>
                </tr>
                <tr>
                  <td>User Opinions</td>
                  <td>
                    {userOpinions.user1.map((user, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-header" style={{ backgroundColor: 'rgb(139, 178, 178)', color: 'white' }}>{user.name}</div>
                        <div className="card-body">
                          <h5 className="card-title">Academic Opinion</h5>
                          <p className="card-text">{user.AcademicOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Non-Academic Opinion</h5>
                          <p className="card-text">{user.NonAcademicOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Placement Opinion</h5>
                          <p className="card-text">{user.PlacementOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Overall Opinion</h5>
                          <p className="card-text">{user.OverallOpinion || 'No opinion available'}</p>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td>
                    {userOpinions.user2.map((user, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-header" style={{ backgroundColor: 'rgb(139, 178, 178)', color: 'white' }}>{user.name}</div>
                        <div className="card-body">
                          <h5 className="card-title">Academic Opinion</h5>
                          <p className="card-text">{user.AcademicOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Non-Academic Opinion</h5>
                          <p className="card-text">{user.NonAcademicOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Placement Opinion</h5>
                          <p className="card-text">{user.PlacementOpinion || 'No opinion available'}</p>
                          <h5 className="card-title">Overall Opinion</h5>
                          <p className="card-text">{user.OverallOpinion || 'No opinion available'}</p>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
};

export default CollegeCompare;
