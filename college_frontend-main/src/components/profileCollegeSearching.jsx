import React, { useState, useEffect } from 'react';
import './profileCollegeSearching.css';
import axios from 'axios';
import gravatar from 'gravatar';
import { useHistory } from 'react-router-dom';

function CollegeSearchingProfile({ user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts authored by the user
        axios.get(`http://localhost:5000/posts/user/${user._id}`)
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching user posts:', error);
            });
    }, [user._id]);

    return (
        <div className="profile-container">
            <div className="profile">
                <ProfileSection user={user} />
                <Opinions user={user} />
                <PostsSection posts={posts} />
            </div>
        </div>
    );
}

function ProfileSection({user}){
    return (
        <div className="profile_details">
            <ProfilePhotoSection user={user}/>
            <ProfileDataSection user={user}/>
        </div>
    );
  }
  
  function ProfilePhotoSection({user}){
    const gravatarUrl = gravatar.url(user.email, { s: 75,r: "pg", d: 'robohash' });
    return (
        <>
        <div className="profile_photo">
            <div style={{ borderRadius: '50%', overflow: 'hidden', width: 75, height: 75 }}>
                <img src={gravatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div >
                <div>
                    <p className="profile_verified">Verified</p>
                </div>
            </div>
        </div>
        </>
    );
  }
  
  function ProfileDataSection({ user }) {
      // console.log(user);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newUsername, setNewUsername] = useState(user.username);
    const history = useHistory();

    const handleNameEdit = () => {
        setIsEditingName(true);
    };
    const handleUsernameEdit = () => {
        setIsEditingUsername(true);
    };

    const handleNameSubmit = () => {
        axios
    .patch(`http://localhost:5000/users/profile/updateName/${user.email}`, { name: newName })
    .then(response => {
      console.log(response.data);
      setIsEditingName(false);
      history.push('/'); // Replace '/' with the desired URL you want to navigate to
      window.location.reload();
    })
    .catch(error => {
      console.error('Error updating name:', error);
    });
};
      const handleUsernameSubmit = () => {
        axios
          .patch(`http://localhost:5000/users/profile/updateUsername/${user.email}`, { username: newUsername })
          .then(response => {
            console.log(response.data);
            setIsEditingUsername(false);
            history.push('/'); // Replace '/' with the desired URL you want to navigate to
        window.location.reload();
            
          })
          .catch(error => {
            console.error('Error updating username:', error);
          });
      };
    

    return (
        <div className="professional">
            <p style={{ textAlign: 'center', fontSize: '30px', marginTop: "15px", marginBottom: "15px", fontWeight: '500' }}>Personal Details</p>
            <div className="professional_details">
        <div>
        <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Your Name</p>

        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {isEditingName ? (
            <>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="profile-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleNameSubmit();
          }
        }}/>
              <button className="edit-button" onClick={handleNameSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
              <p className="profile-data-values">{user.name}</p>
              <button className="edit-button" onClick={handleNameEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      {/* username */}
      <div className="professional_details">
        <div>
          <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Username</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {isEditingUsername ? (
            <>
              <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="profile-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUsernameSubmit();
          }
        }}/>
              <button className="edit-button" onClick={handleUsernameSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
              <p className="profile-data-values">{user.username}</p>
              <button className="edit-button" onClick={handleUsernameEdit}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
      {/* //email */}
      <div className="professional_details">
        <div>
          <p className="profile_data_rows" style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>Email</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
        </div>
          <p className="profile-data-values">{user.email}</p>
      </div>
        </div>
    );
}

function Opinions({ user }) {
  const history = useHistory(); // Add this line

  const [isEditingAcademicOpinion, setIsEditingAcademicOpinion] = useState(false);
  const [newAcademicOpinion, setNewAcademicOpinion] = useState(user.AcademicOpinion);
  
  const handleAcademicOpinionSubmit = () => {
    axios
      .patch(`http://localhost:5000/users/profile/updateAcademicOpinion/${user.email}`, { AcademicOpinion: newAcademicOpinion })
      .then(response => {
        console.log(response.data);
        setIsEditingAcademicOpinion(false);
        history.push('/'); // Now history is properly defined
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating Academic Opinion:', error);
      });
  };
  return (
    <div className="opinions">
      <p style={{ textAlign: 'center', fontSize: '30px', marginTop: "15px", marginBottom: "15px", fontWeight: '500' }}>Tell us about Yourself</p>
      <div >
        
        <div className="opinion-text" style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginBottom: '5px' }}>
          {isEditingAcademicOpinion ? (
            <>
              <input type="text" value={newAcademicOpinion} placeholder='Tell us about Yourself' onChange={e => setNewAcademicOpinion(e.target.value)} className="opinions-data-values" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAcademicOpinionSubmit();
          }
        }} />
              <button className="edit-button" onClick={handleAcademicOpinionSubmit}>
                Save
              </button>
            </>
          ) : (
            <>
              <p className="opinions-data-values">{user.AcademicOpinion}</p>
              <button className="edit-button" onClick={() => setIsEditingAcademicOpinion(true)}>
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PostsSection({ posts }) {
    const history = useHistory();

    const handleClick = (postId) => {
        history.push(`/post/${postId}`); // Redirect to the post detail page
    };

    return (
        <div className="posts-section" style={{ marginTop: "90px", marginBottom: "20px" }}>
            <p style={{ textAlign: 'center', fontSize: '30px', marginTop: "15px", marginBottom: "15px", fontWeight: '500' }}>Your Posts</p>
            <div className="posts-container" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {posts.length === 0 ? (
                    <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'black' }}>No posts to show</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="post" onClick={() => handleClick(post._id)} style={{ backgroundColor: "white", padding: "10px", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", cursor: "pointer", marginBottom: "10px" }}>
                            <div className="post-content">
                                <p style={{ fontWeight: "bold" }}>Title:</p>
                                <p>{post.title}</p>
                                <p style={{ fontWeight: "bold" }}>Description:</p>
                                <p>{post.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

  
  
export default CollegeSearchingProfile;

