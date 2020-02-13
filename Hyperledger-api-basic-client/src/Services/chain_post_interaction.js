import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to make POST requests to the API

export default {
  async chainPostInteractionService(functionName, projectName, key, index, value) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }

    let data = {
      peers: ["peer0.org1.example.com","peer0.org2.example.com"],
      fcn: '',
      args: []
    };
    data.fcn = functionName;
    data.args.push(projectName);

    switch (functionName) {
      case 'insertValue':

        data.args.push(JSON.stringify(value));

      break;

      case 'editProject':

        data.args.push(key);
        data.args.push(JSON.stringify(value));

      break;

      case 'deleteValue':


      break;

      case 'editTaskByIndex':

        data.args.push(index);
        data.args.push(JSON.stringify(value));
      break;

      case 'deleteElemByIndex':

        data.args.push(key);
        data.args.push(index);

      break;

      case 'deleteElemByName':

        data.args.push(key);
        data.args.push(value);

      break;
      default:

    }

    //The data for this HTTP request will be set at the moment of the calling
    return await axios.post('http://localhost:4000/channels/mychannel/chaincodes/mycc', data,  {headers});
  }
}
