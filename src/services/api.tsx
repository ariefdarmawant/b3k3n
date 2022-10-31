import axios from "axios";

const api = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://asia-southeast2-sejutacita-app.cloudfunctions.net",
});

export default api;