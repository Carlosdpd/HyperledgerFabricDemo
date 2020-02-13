import axios from 'axios';
import token from './auth_token.js';

//HTTP service used to make GET requests to the API

export default {
  async chainGetInteractionService(functionName, projectName, index, value) {

    const headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + token
    }

    let data = {
      peers: ["peer0.org1.example.com","peer0.org2.example.com"],
      fcn: '',
      args: []
    };

    switch (functionName) {
      case 'getValue':
        data.fcn = functionName;
        data.args.push(projectName);
      break;

      case 'getAllHistory':
        data.fcn = functionName;
      break;

      case 'getTaskByIndex':
        data.fcn = functionName;
        data.args.push(projectName);
        data.args.push(index);
      break;

      default:

    }
    //The link for the API must be customized depending on the function
    let base = 'http://localhost:4000/channels/mychannel/chaincodes/mycc?peer=peer0.org1.example.com&fcn=' + data.fcn +'&args=%5B%22'+ data.args +'%22%5D';

    //If we want to get a task by index, we edit our base link to the api
    if (data.fcn === 'getTaskByIndex') {

      //We add the especial character to the beginning of the args.  ie: &args=[
      base = 'http://localhost:4000/channels/mychannel/chaincodes/mycc?peer=peer0.org1.example.com&fcn=' + data.fcn +'&args=%5B'

      for (var i = 0; i < data.args.length; i++) {
        if (i === data.args.length - 1 ) {
          //If its the last element of the array, add quotes to the end of the link, ie: "element"
          base += '%22' + data.args[i] + '%22'

        }else{
          //If its a regular element we append the next value and a comma. ie: "element",
          base += '%22' + data.args[i] + '%22%2C'
        }
      }

      //Finally we add the closing bracket at the end of the link. ie: ]
      base += '%5D'
    }

    return await axios.get(base,  {headers});
  }
}
