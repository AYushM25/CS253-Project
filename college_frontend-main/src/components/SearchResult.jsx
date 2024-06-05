import React from 'react';
import './SearchResult.css';

const SearchResult = ({ students }) => {
  return (
    <div className="search-result">
      <h2 style={{marginLeft:"20px"}}>Student Opinions</h2>
      {students && students.length > 0 ? ( // Check if students array is not empty
        <div>
          {students.map((student, index) => (
            <div key={index} className="student-card card">
              <div className="card-body">
                <h3 className="card-title">{student.name}</h3>
                <p className="card-text">Email: {student.email}</p>
                <p className="card-text">College: {student.college}</p>
                <p className="card-text">Branch: {student.branch}</p>
                <h4 className="card-subtitle mb-2 text-muted">Opinions:</h4>
                <div className="opinions">
                  <p className="opinion">Academic Opinion: {student.AcademicOpinion}</p>
                  <p className="opinion">Non-Academic Opinion: {student.NonAcademicOpinion}</p>
                  <p className="opinion">Placement Opinion: {student.PlacementOpinion}</p>
                  <p className="opinion">Overall Opinion: {student.OverallOpinion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResult;
