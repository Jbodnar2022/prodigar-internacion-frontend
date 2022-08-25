import axios from "axios";

const instance = axios.create({
  baseURL: "https://prodigarinternacion.azurewebsites.net/"
  //baseURL: "https://localhost:44397/"

  //baseURL:"http://localhost:2020/"

});

export default instance;