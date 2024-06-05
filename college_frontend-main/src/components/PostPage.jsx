import React, { Component } from "react";
import Moment from "react-moment";
import "moment-timezone";
import { PersonCircle, HandThumbsUpFill, ExclamationCircleFill, BookmarkFill, Bookmark } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import http from "../services/httpService";
import { api } from "../config.js";
import PostReply from "./createReply";
import "./PostPage.css";

class PostPage extends Component {
  state = {
    post: {
      description: "",
      title: "",
      tags: [],
      author: [],
      upvotes: [],
      reports: [],
      views: 0,
      bookmarks: [],
    },
    replies: [],
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data: post } = await http.get(api.postsEndPoint + id);
    const { data: replies } = await http.get(api.repliesEndPoint + id);
    this.setState({ post: post, replies: replies });
  }

  checkLike() {
    const { user } = this.props;
    const { post } = this.state;
    if (user && post.upvotes && post.upvotes.includes(user._id)) return true;
    else return false;
  }

  checkReport() {
    const { user } = this.props;
    const { post } = this.state;
    if (user && post.reports && post.reports.includes(user._id)) return true;
    else return false;
  }

  checkBookmark() {
    const { user } = this.props;
    const { post } = this.state;
    if (user && post.bookmarks && post.bookmarks.includes(user._id)) return true;
    else return false;
  }

  checkReplyLike(id) {
    const { replies } = this.state;
    const { user } = this.props;
    if (user) {
      for (let i in replies) {
        if (replies[i]._id === id) {
          if (replies[i].upvotes.includes(user._id)) return true;
        }
      }
    }
    return false;
  }

  handleUpvote = async () => {
    try {
      const { data: post } = await http.put(
        api.postsEndPoint + "like/" + this.props.match.params.id,
        {}
      );
      this.setState({ post: post[0] });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You cannot UpVote your own Post!");
      }
    }
  };

  handleReport = async () => {
    try {
      const { data: post } = await http.put(
        api.postsEndPoint + "report/" + this.props.match.params.id,
        {}
      );
      this.setState({ post: post });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You can't report your own post.");
      }
    }
  };
  handleBookmark = async () => {
    try {
      // Update the bookmark status
      const { data: post } = await http.put(
        api.postsEndPoint + "bookmark/" + this.props.match.params.id,
        {}
      );
      this.setState({ post: post }, () => {
        // After updating the state, refetch the post details to ensure synchronization
        this.fetchPostDetails();
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You can't bookmark your own post.");
      }
    }
  };
  
  // Function to fetch post details from the server
  fetchPostDetails = async () => {
    try {
      const id = this.props.match.params.id;
      const { data: post } = await http.get(api.postsEndPoint + id);
      const { data: replies } = await http.get(api.repliesEndPoint + id);
      this.setState({ post: post, replies: replies });
    } catch (error) {
      console.error("Error fetching post details:", error);
      // Handle error if necessary
    }
  };
  

  handleDelete = async () => {
    try {
      await http.delete(api.postsEndPoint + this.props.match.params.id);
      toast.success("Post and replies deleted successfully!");
      window.location.href = "/dashboard";
    } catch (ex) {
      toast.error("Failed to delete post and replies.");
    }
  };

  handleReplyUpvote = async (id) => {
    try {
      await http.put(api.repliesEndPoint + "like/" + id, {});
      const { data: replies } = await http.get(
        api.repliesEndPoint + "/" + this.props.match.params.id
      );
      this.setState({ replies: replies });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("You cannot UpVote your own Reply!");
      }
    }
  };

  render() {
    const { post, replies } = this.state;
    const { user } = this.props;
    const isAdmin = user && user.userType === "Admin";
    const isAuthor = user && post.author && user._id === post.author._id;

    return (
      <div>
        <ToastContainer />
        <div className="container col-lg-6 shadow-lg p-3 mt-5 bg-body rounded">
          <h2>{post.title}</h2>
          <div className="post-description">
            <p className="mt-4" style={{ color: "#ffff0", fontSize: "17px" }}>
              {post.description}
            </p>
          </div>
          <div className="mt-1">
            Related Topics:
            {post.tags &&
              post.tags.map((tag, index) => (
                <span key={index} className="badge badge-success m-1 p-2">
                  {tag.name}
                </span>
              ))}
            <div className="d-flex w-100 justify-content-between mt-3 mb-3">
              <button
                disabled={!user}
                className={
                  this.checkLike()
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                onClick={this.handleUpvote}
              >
                <HandThumbsUpFill className="mr-2" />
                Like {post.upvotes && post.upvotes.length}
              </button>
              <button
                disabled={!user}
                className={
                  this.checkReport()
                    ? "btn btn-danger"
                    : "btn btn-outline-danger"
                }
                onClick={this.handleReport}
              >
                <ExclamationCircleFill className="mr-2" />
                Report {post.reports && post.reports.length}
              </button>
              <p>{post.views} Views</p>
            </div>
            <div
              className="d-flex w-100 justify-content-between"
              style={{ color: "#505050" }}
            >
              <div>
                <PersonCircle size={30} className="mr-2" />
                Posted by {(post.author && post.author.username) || 0}
              </div>
              <p className="mb-1">
                <Moment fromNow>{post.time}</Moment>
              </p>
            </div>
          </div>
          {(isAuthor || isAdmin) && (
            <button
              className="btn btn-danger mt-3"
              onClick={this.handleDelete}
            >
              Delete Post & Replies
            </button>
          )}
        </div>
        {user && <PostReply id={this.props.match.params.id} />}
        <div className="container col-lg-6 shadow-lg p-3 mt-5 bg-body rounded">
          Showing {replies.length} replies
        </div>
        <div>
          {replies &&
            replies.map((reply, index) => (
              <div
                key={index}
                className="container col-lg-6 shadow-lg p-3 mt-3 bg-body rounded"
              >
                <div className="ml-4">
                  <PersonCircle size={30} className="mr-3" />
                  Posted by {reply.author.username}
                </div>
                <div className="m-4">{reply.comment}</div>
                <div className="d-flex w-100 justify-content-between mt-3 mb-3">
                  <button
                    className={
                      this.checkReplyLike(reply._id)
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                    disabled={!user}
                    onClick={() => {
                      this.handleReplyUpvote(reply._id);
                    }}
                  >
                    <HandThumbsUpFill className="mr-2" />
                    {reply.upvotes.length}
                  </button>
                  <p className="mb-1" style={{ color: "#505050" }}>
                    <Moment fromNow>{reply.time}</Moment>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default PostPage;
