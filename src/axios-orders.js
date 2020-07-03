import axios from "axios";

const instance = axios.create({
   baseURL: "https://react-my-burger-fbadf.firebaseio.com/",
});

export default instance;
