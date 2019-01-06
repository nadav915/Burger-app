import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://my-burger-ac371.firebaseio.com/',
});

export default instance;