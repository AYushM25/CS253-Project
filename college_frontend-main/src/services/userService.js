import http from "./httpService";
import { api } from "../config.js";


export function register(user) {
  return http.post(api.usersEndPoint + "register", {
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
    userType: user.userType,
    college: user.college,
    branch: user.branch,
    year: user.year,
    AcademicOpinion: user.AcademicOpinion,
    NonAcademicOpinion: user.NonAcademicOpinion,
    PlacementOpinion: user.PlacementOpinion,
    OverallOpinion: user.OverallOpinion,
  });
}

export function verifyOTP(user) {
  return http.put(`${api.usersEndPoint}verify/${user._id}`, { isVerified: true });
}
