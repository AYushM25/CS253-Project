import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["x-auth-token"] = token;
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      toast.error("Network error occurred. Please check your internet connection.");
    } else {
      const { status } = error.response;
      if (status >= 400 && status < 500) {
        if (status === 401) {
          toast.error("Unauthorized access. Please log in again.");
        } else if (status === 404) {
          toast.error("Resource not found.");
        } else {
          toast.error("Client error occurred.");
        }
      } else {
        toast.error("Server error occurred. Please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
