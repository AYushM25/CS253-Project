import "./collegePredictor.css";
import { useState, useEffect } from "react";
import colleges from './colleges.json';
import { ToastContainer, toast } from "react-toastify";

function isEmpty(obj) {
    return Object.keys(obj).filter(key => key !== 'examination').every(key => obj[key] === "" || obj[key] === null);
}

  function CollegePredictor() {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedInputs, setSelectedInputs] = useState({
      category: "",
      AIR: null,
      preferredCollege: "",
      preferredBranch: "",
      examination: "",
      gender: ""
    });
  
    const handleSubmission = () => {
        if (isEmpty(selectedInputs)) {
          toast.error("Please fill in at least one input (excluding examination) to see predicted colleges.");
        } else {
          setShowOptions(true);
        }
      };
  
      useEffect(() => {
        setShowOptions(false);
      }, [selectedInputs]);
  
    return (
      <>
          <ToastContainer />
        <div className="whiteback">
          <div className="header-text">
            <h1>College Predictor</h1>
          </div>
          <div className="centerplace">
            <InputDataSection colleges={colleges} setSelectedInputs={setSelectedInputs} selectedInputs={selectedInputs} />
          </div>
          <div className="submit-button">
            <button className="submit-button-text" onClick={handleSubmission}>Submit</button>
          </div>
          {showOptions && (
            <div className="CollegePredictor">
              <OptionsSection colleges={colleges} selectedInputs={selectedInputs} />
            </div>
          )}
        </div>
      </>
    );
  }
  

function InputDataSection({ colleges, setShowOptions, setSelectedInputs, selectedInputs }) {
  const uniqueCollegeNames = new Set();
  colleges.forEach(college => {
    uniqueCollegeNames.add(college["College"]);
  });

  const uniqueCollegeNamesArray = Array.from(uniqueCollegeNames);

  const uniqueBranchNames = new Set();
  colleges.forEach(college => {
    uniqueBranchNames.add(college["Academic Program Name"]);
  });
  const uniqueBranchNamesArray = Array.from(uniqueBranchNames);

  const handleInputChange = (name, value) => {
    if (name === "AIR") {
      const intValue = parseInt(value);
      if (value === "" || (Number.isInteger(intValue) && intValue > 0)) {
        setSelectedInputs({
          ...selectedInputs,
          [name]: value === "" ? null : intValue
        });
      } else {
        alert("Please enter a valid positive integer value for AIR or leave it empty.");
        setSelectedInputs({
          ...selectedInputs,
          [name]: null
        });
      }
    } else {
      setSelectedInputs({
        ...selectedInputs,
        [name]: value
      });
    }
  };

  return (
    <>
      <form className="input-section">
        <div className="form__group">
          <select className="form__field" onChange={(e) => handleInputChange("examination", e.target.value)}>
            <option value="">Choose Examination:</option>
            <option value="JEE Advanced">JEE Advanced</option>
          </select>
        </div>
        <div className="form__group">
          <select className="form__field" onChange={(e) => handleInputChange("category", e.target.value)}>
            <option value="">Choose Category:</option>
            <option value="OPEN">OPEN</option>
            <option value="OPEN (PwD)">OPEN (PwD)</option>
            <option value="EWS">EWS</option>
            <option value="EWS">EWS (PwD)</option>
            <option value="OBC-NCL">OBC-NCL</option>
            <option value="OBC-NCL">OBC-NCL (PwD)</option>
            <option value="SC">SC</option>
            <option value="SC (PwD)">SC (PwD)</option>
            <option value="ST">ST</option>
            <option value="ST (PwD)">ST (PwD)</option>
          </select>
        </div>
        <div className="form__group">
          <input
            type="number"
            className="form__field"
            placeholder="Enter Category AIR"
            value={selectedInputs.AIR !== null ? selectedInputs.AIR : ''}
            onChange={(e) => handleInputChange("AIR", e.target.value)}
          />
        </div>
        <div className="form__group">
          <select className="form__field" onChange={(e) => handleInputChange("gender", e.target.value)}>
            <option value="">Choose Gender:</option>
            <option value="Gender-Neutral">Gender-Neutral</option>
            <option value="Female-only (including Supernumerary)">Female-only (including Supernumerary)</option>
          </select>
        </div>
        <div className="form__group">
          <select className="form__field" value={selectedInputs.preferredCollege} onChange={(e) => handleInputChange("preferredCollege", e.target.value)}>
            <option value="">Choose Preferred College:</option>
            {uniqueCollegeNamesArray.map((collegeName, index) => (
              <option key={index} value={collegeName}>{collegeName}</option>
            ))}
          </select>
        </div>
        <div className="form__group">
          <select className="form__field" value={selectedInputs.preferredBranch} onChange={(e) => handleInputChange("preferredBranch", e.target.value)}>
            <option value="">Choose Preferred Branch:</option>
            {uniqueBranchNamesArray.map((branchName, index) => (
              <option key={index} value={branchName}>{branchName}</option>
            ))}
          </select>
        </div>
      </form>
    </>
  );
}

function OptionsSection({ colleges, selectedInputs }) {
  const [displayCount, setDisplayCount] = useState(10);
  useEffect(() => {
    setDisplayCount(10);
  }, [selectedInputs]);

  const filteredColleges = colleges.filter((college) => {
    return (
      (selectedInputs.preferredCollege === "" ||
        college["College"] === selectedInputs.preferredCollege) &&
      (selectedInputs.preferredBranch === "" ||
        college["Academic Program Name"] === selectedInputs.preferredBranch) &&
      (selectedInputs.AIR === "" ||
        college["Closing Rank"] >= selectedInputs.AIR) &&
      (selectedInputs.category === "" ||
        college["Seat Type"] === selectedInputs.category) &&
      (selectedInputs.gender === "" ||
        college["Gender"] === selectedInputs.gender)
    );
  });

  const handleShowMore = () => {
    setDisplayCount(displayCount + 10);
  };

  return (
    <div className="available">
      <p style={{ textAlign: "center", fontSize: "30px", marginTop: "15px" }}>
        Available Options
      </p>
      <CollegeList
        colleges1={filteredColleges}
        displayCount={displayCount}
        totalColleges={filteredColleges.length}
        onShowMore={handleShowMore}
      />
    </div>
  );
}

function CollegeList({ colleges1, displayCount, totalColleges, onShowMore }) {
  if (colleges1.length === 0) {
    return (
      <p>There are {totalColleges} options Possible Based on Your Search</p>
    );
  } else {
    const sortedColleges = [...colleges1].sort(
      (a, b) => a["Closing Rank"] - b["Closing Rank"]
    ).slice(0, displayCount);

    return (
      <section>
        <ul className="available">
          {sortedColleges.map((college1) => (
            <College
              key={`${college1["College"]}-${college1["Academic Program Name"]}`}
              college1={college1}
            />
          ))}
        </ul>
        {totalColleges > displayCount && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button onClick={onShowMore} className="show-more-button">Show More</button>
          </div>
        )}

        {totalColleges > displayCount ?
          <p style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>Showing {displayCount} out of {totalColleges} options Possible Based
            on Your Search</p> :
          <p style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}> There are {totalColleges} Possible options based on your search </p>}


      </section>
    );
  }
}

function College({ college1 }) {
  return (
    <li className="available">
      <div className="available_details">
        <div>
          <p className="available_data_rows">{college1["College"]}</p>
        </div>
        <div>
          <p className="available_data_values">Seat Type: {college1["Seat Type"]}</p>
        </div>
        <div>
          <p className="available_data_values">Gender : {college1["Gender"]}</p>
        </div>
        <div>
          <p className="available_data_values">Category Closing Rank : {college1["Closing Rank"]}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <p className="available_data_values">{college1["Academic Program Name"]}</p>
        </div>
      </div>
    </li>
  );
}

function Alternate() {
  return (
    <div style={{ borderStyle: "none", display: "flex", justifyContent: "center", fontSize: "20px", fontWeight: "bold", marginTop: "8px" }}>
      Please add all the Informations to See Predicted Colleges
    </div>
  );
}

export default CollegePredictor;
