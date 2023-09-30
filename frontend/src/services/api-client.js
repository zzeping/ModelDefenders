import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll() {
    return axiosInstance
      .get(this.endpoint)
      .then((res) => res.data);
  }

  // pass token to check if authorized. 
  get(id, token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axiosInstance
      .get(this.endpoint + '/' + id, config)
      .then((res) => res.data);
  }

  post = (data) => {
    return axiosInstance
      .post(this.endpoint, data)
      .then(res => res.data);
  }

}

export default APIClient;
