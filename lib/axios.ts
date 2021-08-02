import axios from "axios";

export const ac = axios.create({
  baseURL: "http://localhost:4000/api",
});
