import React from "react";
import {ToastContainer } from "react-toastify";
import Form from "./common/form";
import { createreply } from "../services/replyCreateService";


class PostReply extends Form {
  state = {
    data: {
      comment: "",
    },
    errors: { comment: "" },
  };
  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { data: reply } = await createreply(data, this.props.id);
      window.location = `/post/${this.props.id}`;
    } catch (ex) {}
  };
  render() {
    const { data, errors } = this.state;
    const isDisabled = !data.comment.trim();
    return (
      <React.Fragment>
        <ToastContainer />
        <div className="container col-lg-6 shadow-lg p-3 mt-5 bg-body rounded">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Post Reply (min. 5 characters)</label>
              <textarea
                className="border border-primary form-control"
                style={{ height: 150 }}
                value={data.comment}
                onChange={this.handleChange}
                name="comment"
                type="comment"
                id="comment"
              />
              <div className="text-center">
                <button
                  className="btn btn-primary mt-4"
                  disabled={isDisabled}
                >
                  Post Reply
                </button>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PostReply;
