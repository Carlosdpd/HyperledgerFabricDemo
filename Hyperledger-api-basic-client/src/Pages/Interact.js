//Interact tab page
import React, { Component } from 'react';
import '../Styles/Interact.css';
import chainPostInteraction from '../Services/chain_post_interaction.js';
import chainGetInteraction from '../Services/chain_get_interaction.js';

import { Input, List, Button } from 'semantic-ui-react';

class Interact extends Component {

  constructor() {
    super();
    //State variable to handle all of the querys responses and results.
    this.state = {

      requestStatus: null,
      postResponse: null,
      getResponse: null,

      insertKey: '',
      insertValue: '',
      modifyKey: '',
      modifyValue: '',
      deleteKey: '',
      getKey: '',
      getHistoryKey:''

    };
  }

  resetInputs(){
    this.setState({
      insertKey: '',
      insertValue: '',
      modifyKey: '',
      modifyValue: '',
      deleteKey: '',
      getKey: '',
      getHistoryKey:''
    });
  }

  //Function to scroll to end of the page when a query is made.
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  /*This is the main function which handles the interaction with the API.
  All the writing queries (insert, modify and delete functions) must be a POST request
  while all of the get queries (get element, get element history and get all elements) must be GET requests
  this is the reason behind the existence of two interaction methods:
  -chainPostInteraction.chainPostInteractionService
  -chainGetInteraction.chainGetInteractionService
  */
  chainInteractionRequest(fcn, element, value) {

    //Clean all states when calling a new requet
    this.setState({
      requestStatus: null,
      postResponse: null,
      getResponse: null,
    });

    //HARDCODED, FOR NOW, this is the main structure that the API needs to work
    let data = {
      peers: ["peer0.org1.example.com","peer0.org2.example.com"],
      fcn: '',
      args: []
    };

    switch (fcn) {
      //If click on insert value button
      case 'insertValue':

      data.fcn = fcn;
      data.args.push(element);
      data.args.push(value);
      chainPostInteraction.chainPostInteractionService(data).then((chainResponse) => {

        this.setState({
          requestStatus : chainResponse.status,
          postResponse : chainResponse.data
        });

        this.resetInputs();

      }).catch(error => {

        //If an error occurs, show it on console.
        console.log("Error:" + error.message);
        this.setState({
          isFetching: false,
        });

      });

      break;

      case 'modifyValue':

        //If click on modify value button
        data.fcn = fcn;
        data.args.push(element);
        data.args.push(value);
        chainPostInteraction.chainPostInteractionService(data).then((chainResponse) => {

          this.setState({
            requestStatus : chainResponse.status,
            postResponse : chainResponse.data
          });

          this.resetInputs();

        }).catch(error => {

          //If an error occurs, show it on console.
          console.log("Error:" + error.message);
          this.setState({
            isFetching: false,
            onError: true
          });

        });

        break;

      case 'getValue':

        //If click on modify value button
        data.fcn = fcn;
        data.args.push(element);
        chainGetInteraction.chainGetInteractionService(data).then((chainResponse) => {

          console.log(chainResponse);

          this.setState({
            requestStatus : chainResponse.status,
            getResponse : element+ ' - ' + chainResponse.data
          });

          this.resetInputs();

        }).catch(error => {

          //If an error occurs, show it on console.
          console.log("Error:" + error.message);
          this.setState({
            isFetching: false,
            onError: true
          });

        });

        break;

      case 'deleteValue':

        //If click on delete value button
        data.fcn = fcn;
        data.args.push(element);
        chainPostInteraction.chainPostInteractionService(data).then((chainResponse) => {

          this.setState({
            requestStatus : chainResponse.status,
            postResponse : chainResponse.data
          });

          this.resetInputs();

        }).catch(error => {

          //If an error occurs, show it on console.
          console.log("Error:" + error.message);
          this.setState({
            isFetching: false,
            onError: true
          });

        });

        break;

      case 'getKeyHistory':

        //If click on get key history button
        data.fcn = fcn;
        data.args.push(element);
        chainGetInteraction.chainGetInteractionService(data).then((chainResponse) => {
          /*The response for this requests is an array, that means we must map the content so we can return
          list elements*/

          console.log(chainResponse);

          const transformedData =  chainResponse.data.map((record, i) => {
             return (

                <List.Item key={i}> {element} - {JSON.stringify(record.Record)}</List.Item>
              );
          });

          this.setState({
            requestStatus : chainResponse.status,
            getResponse : transformedData
          });

          this.resetInputs();


        }).catch(error => {

          //If an error occurs, show it on console.
          console.log("Error:" + error.message);
          this.setState({
            isFetching: false,
            onError: true
          });

        });

        break;

      case 'getAllHistory':

        //If click on get all values
        data.fcn = fcn;
        chainGetInteraction.chainGetInteractionService(data).then((chainResponse) => {
          /*The response for this requests is an array, that means we must map the content so we can return
          list elements*/

          console.log(chainResponse);

          const transformedData =  chainResponse.data.map((record, i) => {
             return (
                <List.Item key={i}> {record.Key} - {JSON.stringify(record.Record)}</List.Item>
              );
          });

          this.setState({
            requestStatus : chainResponse.status,
            getResponse : transformedData
          });

          this.resetInputs();

        }).catch(error => {

          //If an error occurs, show it on console.
          console.log("Error:" + error.message);
          this.setState({
            isFetching: false,
            onError: true
          });

        });

      break;

      default:

        console.log("This function is not supported");

        break;

    }

  }

  render() {
      return (
            <div>

            <List style={{ "textAlign": "left"}}>
                <List.Header>Insert a new element in the chain</List.Header>
                  <List.Item>
                      <Input placeholder='Element key'
                      value={this.state.insertKey}
                      onChange={event => this.setState({ insertKey: event.target.value })}/>
                  </List.Item>
                  <List.Item>
                    <Input placeholder='Element value'
                      value={this.state.insertValue}
                      onChange={event => this.setState({ insertValue: event.target.value })}/>
                  </List.Item>
                  <List.Item>
                      <Button primary onClick={ () => {
                        this.chainInteractionRequest('insertValue', this.state.insertKey, this.state.insertValue)
                      } } >Insert element</Button>
                  </List.Item>
                <List.Header>Modify an existing element in the chain</List.Header>
                  <List.Item>
                    <Input placeholder='Element key'
                      value={this.state.modifyKey}
                      onChange={event => this.setState({ modifyKey: event.target.value })}/>
                  </List.Item>
                  <List.Item>
                    <Input placeholder='Modification value'
                      value={this.state.modifyValue}
                      onChange={event => this.setState({ modifyValue: event.target.value })}/>
                  </List.Item>
                  <List.Item>
                    <Button primary onClick={ () => {
                      this.chainInteractionRequest('modifyValue', this.state.modifyKey, this.state.modifyValue)
                    } } >Modify element</Button>
                  </List.Item>
                <List.Header>Delete an existing value in the chain</List.Header>
                <List.Item>
                  <Input placeholder='Element key'
                  value={this.state.deleteKey}
                  onChange={event => this.setState({ deleteKey: event.target.value })}/>
                </List.Item>
                <List.Item>
                  <Button primary onClick={ () => {
                    this.chainInteractionRequest('deleteValue', this.state.deleteKey, '');
                  } } >Delete element</Button>
                </List.Item>
                <List.Header>Get value an existing element in the chain</List.Header>
                  <List.Item>
                    <Input placeholder='Element key'
                    value={this.state.getKey}
                    onChange={event => this.setState({ getKey: event.target.value })}/>
                  </List.Item>
                  <List.Item>
                    <Button primary onClick={ () => {
                      this.chainInteractionRequest('getValue', this.state.getKey, '');
                    } } >Get element</Button>
                  </List.Item>
                <List.Header>Get element history</List.Header>
                  <List.Item>
                    <Input placeholder='Element key'
                    value={this.state.getHistoryKey}
                    onChange={event => this.setState({ getHistoryKey: event.target.value })}/>
                </List.Item>
                <List.Item>
                  <Button primary onClick={ () => {
                    this.chainInteractionRequest('getKeyHistory', this.state.getHistoryKey, '');
                  } } >Get element</Button>
                </List.Item>
                <List.Header>Get all elements</List.Header>
                  <List.Item>
                    <Button primary onClick={ () => {
                      this.chainInteractionRequest('getAllHistory', '', '');
                    } } >Get all elements</Button>
                  </List.Item>
            </List>

            <div className='separator'></div>

            {this.state.requestStatus && this.state.postResponse
              ?  <div>
                    <p>Transaction submitted successfully!</p>
                    <List>
                      <List.Item>
                        <List.Header>Transaction Status</List.Header>
                        <p>{this.state.requestStatus}</p>
                      </List.Item>
                      <List.Item>
                        <List.Header>Transaction ID from query</List.Header>
                        <ul>{this.state.postResponse}</ul>
                      </List.Item>
                    </List>
                 </div>
               :
                null
            }

            {this.state.requestStatus && this.state.getResponse
              ?  <div>
                    <List>
                      <List.Item>
                        <List.Header>Transaction Status</List.Header>
                        <p>{this.state.requestStatus}</p>
                      </List.Item>
                      <List.Item>
                        <List.Header>Result of query</List.Header>
                        <List>{this.state.getResponse}</List>
                      </List.Item>
                    </List>
                 </div>
               :
                null
            }

            <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}></div>
            </div>
      );
  }
}

export default Interact;
