import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import { Route, Switch, Redirect } from "react-router-dom";

import http from "./services/httpService";
import { api } from "./config.js";
import Dashboard from "./components/dashboard";
import NotFound from "./components/not-found";
import NewPost from "./components/createpost";
import Log from "./components/log";
import Logout from "./components/logout";
import OTP from "./components/otp";
import Register from "./components/register";
import NavBar from "./components/navbar";
import ProtectedRoute from "./components/common/protectedRoute";
import PostPage from "./components/PostPage";
import Search from "./components/search.jsx";
import CollegeCompare from "./components/CollegeCompare.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import CollegePedictor from "./components/collegePredictor";

class App extends Component {
  state = {};

  async componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user_jwt = jwtDecode(jwt);
      const user = await http.get(`${api.usersEndPoint}${user_jwt._id}`);
      this.setState({ user: user.data });
    } catch (ex) {}
  }

  render() {
    return (
      <div>
        <NavBar user={this.state.user} />
        <Switch>
          <Route path="/users/login" component={Log} />
          <Route path="/users/register" component={Register} />
          <Route path="/users/logout" component={Logout} />
          <Route
            path="/otp"
            render={(props) => <OTP {...props} user={this.state.user} />}
          />
          <Route path="/users/search" component={Search} />
          <Route path="/users/compare" component={CollegeCompare} />
          <Route path="/users/collegepredictor" component={CollegePedictor} />
          <Route
            path="/profile"
            render={(props) =>
              this.state.user ? (
                this.state.user.isVerified ? (
                  <Profile {...props} user={this.state.user} />
                ) : (
                  <Redirect to="/otp" />
                )
              ) : (
                <Redirect to="/users/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            render={(props) =>
              this.state.user ? (
                this.state.user.isVerified ? (
                  <Dashboard {...props} user={this.state.user} />
                ) : (
                  <Redirect to="/otp" />
                )
              ) : (
                <Redirect to="/users/login" />
              )
            }
          />
          <Route path="/not-found" component={NotFound} />
          <ProtectedRoute
            path="/new-post"
            render={(props) =>
              this.state.user ? (
                this.state.user.isVerified ? (
                  <NewPost {...props} user={this.state.user} />
                ) : (
                  <Redirect to="/otp" />
                )
              ) : (
                <Redirect to="/users/loginr" />
              )
            }
          />
          <Route
            path="/post/:id"
            render={(props) =>
              this.state.user ? (
                this.state.user.isVerified ? (
                  <PostPage {...props} user={this.state.user} />
                ) : (
                  <Redirect to="/otp" />
                )
              ) : (
                <Redirect to="/users/login" />
              )
            }
          />
          <Route
            path="/me"
            render={(props) =>
              this.state.user ? (
                this.state.user.isVerified ? (
                  <Profile {...props} user={this.state.user} />
                ) : (
                  <Redirect to="/otp" />
                )
              ) : (
                <Redirect to="/users/loginr" />
              )
            }
          />
          <Route exact path="/" component={Home} />
          <Redirect from="/users" to="/users/login " />
          <Redirect to="/not-found" />
        </Switch>
      </div>
    );
  }
}

export default App;
