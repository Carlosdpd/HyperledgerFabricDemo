import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to query the blocks by TRANSACTION.

export default {
  async getTxByIDService(data) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }

    //The data for this HTTP request will be set at the moment of the calling (ValsanLogin.js)
    return await axios.get('http://localhost:4000/channels/mychannel/transactions/' + data +'?peer=peer0.org1.example.com', {headers});
  }
}
