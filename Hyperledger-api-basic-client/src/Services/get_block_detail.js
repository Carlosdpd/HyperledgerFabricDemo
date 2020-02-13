import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to query the blocks by NUMBER.

export default {
  async getBlockDetailervice(blockNumber) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }
    return await axios.get('http://localhost:4000/channels/mychannel/blocks/' + blockNumber +'?peer=peer0.org1.example.com', {headers});
  }
}
