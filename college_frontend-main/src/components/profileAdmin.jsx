import React, { useState, useEffect } from 'react';
import './profileAdmin.css';
import gravatar from 'gravatar';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function AdminProfile({ user }) {
    const [userCounts, setUserCounts] = useState({});
    const [adminPosts, setAdminPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 1;

    useEffect(() => {
        axios.get('http://localhost:5000/users/user-count')
            .then(response => {
                setUserCounts(response.data);
            })
            .catch(error => {
                console.error('Error fetching user counts:', error);
            });

        axios.get(`http://localhost:5000/posts/user/${user._id}`)
            .then(response => {
                setAdminPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching admin posts:', error);
            });
    }, [user._id]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = adminPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="profile-container">
            <div className="profileadmin">
                <ProfileSection user={user} />
                <DonutChart userCounts={userCounts} />
                <AdminPostsSection posts={currentPosts} paginate={paginate} postsPerPage={postsPerPage} totalPosts={adminPosts.length} />
            </div>
        </div>
    );
}

function AdminPostsSection({ posts, paginate, postsPerPage, totalPosts }) {
    const history = useHistory();

    const handleClick = (postId) => {
        history.push(`/post/${postId}`); 
    };

    return (
        <div className="container-fluid p-0" style={{ marginLeft: "30px", marginTop: "20px" }}>
            <div className="rounded p-4" style={{ marginRight: "40px",marginTop:"70px", borderStyle: "solid", borderColor: "lightslategray", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <p style={{ textAlign: 'center', fontSize: '30px', marginBottom: "30px", fontWeight: '500' }}>Your Posts</p>
                <div className="list-group" style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'black' }}>No posts to show</p>
                    ) : (
                        posts.map(post => (
                            <Link
                                className="list-group-item list-group-item-action flex-column align-items-start"
                                to={`/post/${post._id}`}
                                key={post._id}
                                onClick={() => handleClick(post._id)}
                                style={{ padding: "10px", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", cursor: "pointer", marginBottom: "10px" }}
                            >
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{post.title}</h5>
                                </div>
                                <small>Created by You</small>
                                <br />
                                <small className="overflow-hidden">{post.description}</small>
                                <div className="mt-1">
                                    Related Topics:
                                    {post.tags.map((tag, index) => (
                                        <span className="badge badge-secondary m-1 p-2" key={index}>{tag.name}</span>
                                    ))}
                                    <h6 className="mt-2">
                                        {post.upvotes.length} Likes | {post.views} Views
                                    </h6>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                {/* Pagination */}
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, index) => (
                        <li className="page-item" key={index}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}



function DonutChart({ userCounts }) {
  const series = [userCounts.collegeS || 0, userCounts.collegeG || 0, userCounts.admin || 0];
  const options = {
    labels: ['College Searching', 'College Going', 'Admins'],
    chart: {
      type: 'donut',
    },
  };

  return (
    <div className="professional" style={{ display: "grid", marginTop: "90px", marginBottom: "20px" }}>
      <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '15px', marginBottom: '15px', fontWeight: '500' }}>
        User Distribution
      </p>
      <div style={{ maxHeight: '100%', overflow: 'hidden' }}>
        <ReactApexChart options={options} series={series} type="donut" />
      </div>
    </div>
  );
}

function ProfileSection({ user }) {
  return (
    <div className="profile_details">
      <ProfilePhotoSection user={user} />
      <ProfileDataSection user={user} />
    </div>
  );
}

function ProfilePhotoSection({ user }) {
  const gravatarUrl = gravatar.url(user.email, { s: 75, r: "pg", d: 'robohash' });
  return (
    <div className="profile_photo">
      <div style={{ borderRadius: '50%', overflow: 'hidden', width: 75, height: 75 }}>
        <img src={gravatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <div>
          <p className="profile_verified">Verified</p>
        </div>
      </div>
    </div>
  );
}

function ProfileDataSection({ user }) {
  
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
        history.push('/users/profile');
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
        history.push('/');
        window.location.reload();
        
      })
      .catch(error => {
        console.error('Error updating username:', error);
      });
  };


  return (
    <div className="professional">
      <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '15px', marginBottom: '15px', fontWeight: '500' }}>
        Personal Details
      </p>
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
          <p className="profile-data-values">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
  
export default AdminProfile;
