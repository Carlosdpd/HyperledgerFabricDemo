import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to query the chain and obtain the number of blocks.

export default {
  async downloadFileService(data) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }

    return await axios.get('http://localhost:4000/download/' + data.projectName + '/' + data.fileName, {headers, responseType: 'blob'});
  }
}
