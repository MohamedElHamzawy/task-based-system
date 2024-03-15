import axios from "axios";
import GetCookie from "./hooks/getCookie";

const token = GetCookie("AdminToken");

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}:5000/api`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;
