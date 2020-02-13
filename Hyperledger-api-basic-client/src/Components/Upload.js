import React from 'react'
import  { post } from 'axios';
import token from '../Services/auth_token.js';
import sha256 from '../utils/sha256.js';
import chainPostInteraction from '../Services/chain_post_interaction.js';
import { Message, Dimmer, Loader } from 'semantic-ui-react';

class Upload extends React.Component {

  constructor(props) {
    super(props);

    this.state ={
      file: null,
      projectName: '',
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: false,
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  componentDidMount() {
    this.setState({
      projectName: this.props.projectName
    });
  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(fcn, projectName, key, value) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse: null,
      getResponse: null,
      isLoading: true,
    });

    chainPostInteraction.chainPostInteractionService(fcn, projectName, key, null, value).then((chainResponse) => {

      this.setState({
        requestStatus : chainResponse.status,
        postResponse : chainResponse.data,
        isLoading: false,

      });

    }).catch(error => {

      //If an error occurs, show it on console.
      console.log("Error:" + error.message);
      this.setState({
        isLoading: false,

      });

      this.resetInputs();

    });

  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response)=>{
      if (response.status === 200) {
        this.chainInteractionRequest('editProject', this.state.projectName, 'documents', this.state.file.name)
      }
    });
    this.setState({
      isLoading: true,

    });
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0]
    })
  }

  fileUpload(file){
    const url = 'http://localhost:4000/upload';
    const formData = new FormData();
    formData.append('file',file);
    formData.append('projectName', this.state.projectName);

    const config = {
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer ' + token
        }
    }
    return post(url, formData, config)
  }

  render() {

    const message = 'The transaction id is:' + this.state.postResponse;

    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        {this.state.isLoading
          ?
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
           :
            null
        }
        {this.state.requestStatus && this.state.postResponse
          ?  <div>
                  <Message
                    success
                    header='Transaction submitted successfully!'
                    content={message}
                  / >

             </div>
           :
            null
        }
      </div>

   )
  }
}

export default Upload;
