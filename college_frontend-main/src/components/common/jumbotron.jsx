import React from "react";
import forumImage from "../images/forum.png";
const Jumotron = () => {
  const jumbotronStyle = {
    backgroundColor: "rgb(160, 199, 199)",
    color: "white",
    padding: "50px",
    borderRadius: "10px",
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "bold",
  };

  const paragraphStyle = {
    fontSize: "24px",
    fontStyle: "italic",
  };

  return (
    <div className="jumbotron" style={jumbotronStyle}>
      <div className="image-container">
  <img src={forumImage} className="home_img" alt="" style={{ maxWidth: '700px', maxHeight: '350px' }} />
</div>

      <p style={paragraphStyle}>
        Join the Discussion, Share Your Insights, and Connect with the Community!
      </p>
    </div>
  );
};

export default Jumotron;
