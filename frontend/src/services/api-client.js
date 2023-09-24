import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
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

  get(id) {
    return axiosInstance
      .get(this.endpoint + '/' + id)
      .then((res) => res.data);
  }

  post = (data) => {
    return axiosInstance
      .post(this.endpoint, data)
      .then(res => res.data);
  }

}

export default APIClient;
