import React from "react";
import "./register.css";
import Input from "./common/input";
import Form from "./common/form";
import { Redirect } from "react-router-dom";
import * as userService from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/react-toastify.esm";
import LoginImage from "./images/1.jpg";
import Logo from "./images/logo.jpg"

class Register extends Form {
  state = {
    data: {
      name: "",
      username: "",
      email: "",
      password: "",
      password2: "",
      userType: "collegeS",
      college: "",
      branch: "",
      year: "",
      AcademicOpinion: "",
      NonAcademicOpinion: "",
      PlacementOpinion: "",
      OverallOpinion: "",
    },
    errors: {},
  };

  doSubmit = async (event) => {
    event.preventDefault();
    const { data } = this.state;

    // Check for empty fields
    for (let key in data) {
    if (!data[key] && key !== "year" && key !== "branch" && key !== "college" && key !== "userType" && key !== "AcademicOpinion" && key !== "NonAcademicOpinion" && key !== "PlacementOpinion" && key !== "OverallOpinion") {
      toast.error("Please fill in all fields.");
      return;
      }
    }

    // Check if passwords match
    if (data.password !== data.password2) {
      toast.error("Passwords do not match.");
      return;
    }
    
    const { name, username, email, password } = data;
    const fieldsToCheck = { name, username, email, password };
    for (let field in fieldsToCheck) {
      const fieldValue = fieldsToCheck[field];
    
      if (fieldValue.trim().length < 5) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 5 characters long.`);
        return;
      }
    }
    
    try {
      const response = await userService.register(this.state.data);
      localStorage.setItem("token", response.headers["x-auth-token"]);
      window.location = `/otp`;
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errorMessage = ex.response.data;
    
        if (errorMessage === "Email already registered") {
          toast.error("Email already registered");
        } else if (errorMessage === "Username not available") {
          toast.error("Username not available");
        } else {
          toast.error("User already registered");
        }
      }
    }    
  };

  render() {
    const { data, errors } = this.state;
    if (localStorage.getItem("token")) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <ToastContainer />
        <div className="login-main">
          <div className="login-left" alt="logo">
            <div className="login-left-top">
              <img src={Logo} />
              <h1> College PathFinder</h1>
              <p>Empowering Futures, Guiding Paths : College PathFinder- Your Journey, Your Choice.</p>
            </div>
            <div className="login-left-bottom">
              <img className="login-image" src={LoginImage} alt="illustration" />
            </div>
          </div>
          <div className="login-right">
            <h1>Register</h1>
            <form onSubmit={this.doSubmit}>
              <Input
                value={data.name}
                onChange={this.handleChange}
                label="Name (min. 5 characters)"
                name="name"
                type="text"
                error={errors.name}
              />
              <Input
                name="username"
                value={data.username}
                label="Username (min. 5 characters)"
                type="text"
                onChange={this.handleChange}
                error={errors.username}
              />
              <Input
                value={data.email}
                onChange={this.handleChange}
                label="Email ID (min. 5 characters)"
                type="text"
                name="email"
                error={errors.email}
              />
              <Input
                value={data.password}
                onChange={this.handleChange}
                label="Password (min. 5 characters)"
                type="password"
                name="password"
                error={errors.password}
              />
              <Input
                value={data.password2}
                onChange={this.handleChange}
                label="Confirm Password"
                name="password2"
                type="password"
                error={errors.password2}
              />
              <div className="mb-3">
                <label htmlFor="userType" className="form-label">
                  User Type
                </label>
                <select
                  className="form-select"
                  id="userType"
                  name="userType"
                  value={data.userType}
                  onChange={this.handleChange}
                >
                  <option value="collegeS">College Searching</option>
                  <option value="collegeG">College Going</option>
                </select>
              </div>
              {data.userType === "collegeG" && (
                <React.Fragment>
                  <label htmlFor="college" className="form-label">
                    College
                  </label>
                  <select
                    className="form-select"
                    id="college"
                    name="college"
                    value={data.college}
                    onChange={this.handleChange}
                  >
                    <option value="">Select College</option>
                    <option value="IIT Bombay">IIT Bombay</option>
                    <option value="IIT Delhi">IIT Delhi</option>
                    <option value="IIT Madras">IIT Madras</option>
                    <option value="IIT Kanpur">IIT Kanpur</option>
                    <option value="IIT Kharagpur">IIT Kharagpur</option>
                    <option value="IIT Roorkee">IIT Roorkee</option>
                    <option value="IIT Guwahati">IIT Guwahati</option>
                    <option value="IIT Hyderabad">IIT Hyderabad</option>
                    <option value="IIT Gandhinagar">IIT Gandhinagar</option>
                    <option value="IIT Ropar">IIT Ropar</option>
                    <option value="IIT Bhubaneswar">IIT Bhubaneswar</option>
                    <option value="IIT Indore">IIT Indore</option>
                    <option value="IIT Patna">IIT Patna</option>
                    <option value="IIT Mandi">IIT Mandi</option>
                    <option value="IIT (BHU) Varanasi">IIT (BHU) Varanasi</option>
                    <option value="IIT Palakkad">IIT Palakkad</option>
                    <option value="IIT Tirupati">IIT Tirupati</option>
                    <option value="IIT Dhanbad">IIT Dhanbad</option>
                    <option value="IIT Bhilai">IIT Bhilai</option>
                    <option value="IIT Goa">IIT Goa</option>
                    <option value="IIT Jammu">IIT Jammu</option>
                    <option value="IIT Dharwad">IIT Dharwad</option>
                  </select>
                  <label htmlFor="branch" className="form-label">
                    Branch
                  </label>
                  <select
                    className="form-select"
                    id="college"
                    name="branch"
                    value={data.branch}
                    onChange={this.handleChange}
                  >

                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="EE">EE</option>
                    <option value="ME">ME</option>
                    <option value="BSBE">BSBE</option>
                    <option value="MTH">MTH</option>
                    <option value="PHY">PHY</option>
                    <option value="CHM">CHM</option>
                    <option value="CHE">CHE</option>
                    <option value="AE">CIVIL</option>
                    <option value="MSE">AE</option>
                    <option value="MSE">SDS</option>
                    <option value="MSE">MSE</option>
                    <option value="MSE">ECO</option>
                  </select>

                  <Input
                    value={data.year}
                    onChange={this.handleChange}
                    label="Graduation Year"
                    type="text"
                    name="year"
                  />
                  <Input
                    value={data.AcademicOpinion}
                    onChange={this.handleChange}
                    label="Enter your Opinion about Academics of your College"
                    type="text"
                    name="AcademicOpinion"
                    error={errors.AcademicOpinion}
                  />
                  <Input
                    value={data.NonAcademicOpinion}
                    onChange={this.handleChange}
                    label="Enter your Opinion about Non-Academics of your College"
                    type="text"
                    name="NonAcademicOpinion"
                    error={errors.NonAcademicOpinion}
                  />
                  <Input
                    value={data.PlacementOpinion}
                    onChange={this.handleChange}
                    label="Enter your Opinion about Placements of your College"
                    type="text"
                    name="PlacementOpinion"
                    error={errors.PlacementOpinion}
                  />
                  <Input
                    value={data.OverallOpinion}
                    onChange={this.handleChange}
                    label="Enter your Overall Opinion about your College"
                    type="text"
                    name="OverallOpinion"
                    error={errors.OverallOpinion}
                  />
                </React.Fragment>
              )}
              <div className="d-grid gap-2">
              <button className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
