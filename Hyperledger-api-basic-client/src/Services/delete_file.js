import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to query the chain and obtain the number of blocks.

export default {
  async deleteFileService(data) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }

    return await axios.post('http://localhost:4000/deleteFile', data, {headers});
  }
}
