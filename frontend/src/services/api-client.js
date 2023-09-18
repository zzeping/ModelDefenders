const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/user',
});

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll(config) {
    return axiosInstance
      .get(this.endpoint, config)
      .then((res) => res.data);
  }

  get(id) {
    return axiosInstance
      .get(this.endpoint + '/' + id)
      .then((res) => res.data);
  }
}

module.exports = APIClient;
