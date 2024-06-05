import React from 'react';
import { useHistory } from 'react-router-dom';
import CollegeGoingProfile from './profileCollegeGoing';
import CollegeSearchingProfile from './profileCollegeSearching';
import AdminProfile from './profileAdmin';

const ShowProfile = ({ user }) => {
  const history = useHistory();

  if (!user || !user.userType) {
    // Redirect to login if user data or userType is missing
    history.push('/users/login');
    return null; // Prevent rendering anything in this case
  }

  if (user.userType === "collegeG") {
    return <CollegeGoingProfile user={user} />;
  } else if (user.userType === "collegeS") {
    return <CollegeSearchingProfile user={user} />;
  } else if (user.userType === "Admin") {
    return <AdminProfile user={user} />;
  }

  // If user object or userType is missing, render a fallback message or component
  return (
    <div>
      <p>User data not available or userType not specified.</p>
    </div>
  );
};

export default ShowProfile;

