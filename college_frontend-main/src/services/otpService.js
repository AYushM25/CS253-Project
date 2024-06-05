import http from "./httpService";
import { api } from "../config.js";

export function generateOtp(email) {
    return http.post(api.otpEndPoint + "generate", {
        email:email,
    });
  }
  
  export function verifyOTP(email, otpCode) {
    return http.post(api.otpEndPoint + "verify", { 
        email : email, 
        otpCode : otpCode,
    });
  }
