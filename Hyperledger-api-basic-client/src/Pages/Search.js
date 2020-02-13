//searchBar bar script.
import React, { Component } from 'react';
import { Input, Button, List, Header } from 'semantic-ui-react';
import '../Styles/Search.css';
import getTxDetails from '../Services/get_tx_by_id.js';


//Search bar module
export default class Search extends Component {

  constructor() {
    super();
    //State variable to handle all of the querys responses and results.
    this.state = {

      txID: '',
      isLoading: false,
      transactionDetail: null,
      txEventName: null,
      txEventKey: null,
      txEventValue: null,
      txEventEmitter: null,
      txEventTasks: null

    };
  }

  componentDidMount() {
    if (this.props.match.params.data) {
      this.getTxDetailsRequest(this.props.match.params.data)
    }
  }

  getTxDetailsRequest(txID){

    getTxDetails.getTxByIDService(txID).then((txInfo) => {


      //Getting and saving the transaction details
      this.setState({
        transactionDetail: txInfo,
        txEventName: txInfo.data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.events.event_name,
        txEventKey: txInfo.data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes['0'].key,
        txEventEmitter: txInfo.data.transactionEnvelope.payload.data.actions[0].header.creator.Mspid
      });

      //The payload attribute is buffered, we must decode and save it.
      var json = JSON.stringify(this.state.transactionDetail.data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.events.payload);
      let bufferOriginal = Buffer.from(JSON.parse(json).data);
      let eventObject = JSON.parse(bufferOriginal.toString());

      let processedEvent = Object.keys(eventObject).map((keyName, i) => {

        if (keyName !== 'tasks') {

          return(
            <div key={i}>
              <Header as='h4'>{keyName}:</Header>
              <p>{eventObject[keyName]}</p>
            </div>
          )
        }

        return null;
      });

      //If the task field does have more than 1 element, we must map again (Since its an array) to show it properly.
      if (eventObject.tasks.length > 0){
        console.log(eventObject.tasks);
        let processedTasks =  eventObject.tasks.map((record, i) => {

          let recordObj = JSON.parse(record);

           return (
             <div key={i}>

               <Header as='h5'>Name:</Header>
               <p>{recordObj.taskName}</p>
               <Header as='h4'>Description:</Header>
               <p>{recordObj.taskDescription}</p>
               <Header as='h4'>Cost:</Header>
               <p>{recordObj.taskCost}</p>
               <Header as='h4'>Contractor:</Header>
               <p>{recordObj.taskContractor}</p>
               <div className='separator'></div>
             </div>

            );
        });

        //Setting the processed array data to the state
        this.setState({
          txEventTasks: processedTasks

        });

      }

      //Setting the processed event to the state
      this.setState({
        txEventValue: processedEvent,

      });


      this.props.history.push('/search/' + txID);
    }).catch(error => {

      //In case of error.
      console.log("Error:" + error.message);
      this.setState({
        isFetching: false,
        onError: true
      });

    });

  }



  render() {
    return (
      <div>
        <Input
          placeholder='Search by Tx'
          className='search-input'
          value={this.state.txID}
          onChange={event => this.setState({ txID: event.target.value })}/>
        <Button icon='search' loading={this.state.isLoading} onClick={ () => {
            this.getTxDetailsRequest(this.state.txID)
        } } />
        {this.state.transactionDetail
          ?
          <div>
            <div className='separator'></div>
            <List style={{ "textAlign": "left"}}>
              <List.Item>
                <Header as='h2'>Detail of transaction:</Header>
                {this.state.txID}
              </List.Item>
              <List.Item>
                <Header as='h3'>Event Name:</Header>
                {this.state.txEventName}
              </List.Item>
              <List.Item>
                <Header as='h3'>Event Key:</Header>
                {this.state.txEventKey}
              </List.Item>
              <List.Item>
                <Header as='h3'>Event Value:</Header>
                {this.state.txEventValue}
              </List.Item>
              {this.state.txEventTasks ?

                <List.Item>
                  <Header as='h3'>Event Tasks:</Header>
                  {this.state.txEventTasks}
                </List.Item>
                :
                null
              }
              <List.Item>
                <Header as='h3'>Event Creator:</Header>
                {this.state.txEventEmitter}
              </List.Item>
            </List>


          </div>
          : null
         }
      </div>

    )
  }
}
