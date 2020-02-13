import axios from 'axios';

//HTTP service used to make POST requests to the API

export default {
  async loginService(data) {

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    }

    // TODO: There has to be a way to work this around???????
    let chunk = 'username=' + data.username + '&orgName=' + data.orgName;

    //The data for this HTTP request will be set at the moment of the calling (ValsanLogin.js)
    return await axios.post('http://localhost:4000/users', chunk,  {headers});
  }
}
