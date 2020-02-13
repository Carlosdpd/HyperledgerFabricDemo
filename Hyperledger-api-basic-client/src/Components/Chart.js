import React, {Component} from 'react';
import * as d3 from "d3";
import { Loader, List, Header } from 'semantic-ui-react';
import getTxDetails from '../Services/get_tx_by_id.js';


import getBlock from '../Services/get_block_detail.js';

import '../Styles/Chart.css';


class Chart extends Component {

  constructor() {
    super();

    //List of state variables for this component
    this.state = {
      blockDetail: null,
      isFetching: false,
      blockTxID: null,
      blockPrevHash: null,
      blockDataHash: null,
      blockNumber: null,
      blockTimestamp: null,
      transactionDetail: null,
      txEventName: null,
      txEventKey: null,
      txEventValue: null,
      txEventTasks: null,
      txEventEmitter: null
    };
  }

  //As soon as the component mounts, draw the chart containing the blocks.
  componentDidMount() {
    this.drawChart();

  }

  //Call to the API, this call will obtain the details of an specific block from the API running HLF
  getBlockRequest(id){

    //This state controls of the loading bar should be rendered or not.
    this.setState({
      isFetching: true
    });

    getBlock.getBlockDetailervice(id).then((blockInfo)  => {

      this.setState({
        blockDetail: blockInfo
      })

      //Getting and saving the block details
      this.setState({
        blockNumber: this.state.blockDetail.data.header.number,
        blockPrevHash: this.state.blockDetail.data.header.previous_hash,
        blockDataHash: this.state.blockDetail.data.header.data_hash,
        blockTimestamp: this.state.blockDetail.data.data.data[0].payload.header.channel_header.timestamp,
        blockTxID: this.state.blockDetail.data.data.data[0].payload.header.channel_header.tx_id
      })

      //Once all data is fetched, hide the loading spinner
      this.setState({
        isFetching: false,
        transactionDetail: null
      });

      //Re-render the chart with the blocks
      this.drawChart();
    }).catch(error => {

      //In case of error.
      console.log("Error:" + error.message);
      this.setState({
        isFetching: false,
        onError: true
      });

    });

  }

  //Once the transaction is clicked, call the API save the details from the transaction
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
      console.log(this.state.transactionDetail.data.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.events.payload);
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
        };

        return null;
      });

      //If the task field does have more than 1 element, we must map again (Since its an array) to show it properly.
      if (eventObject.tasks.length > 0){
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
               <Header as='h4'>State:</Header>
               <p>{recordObj.taskState}</p>
               <div className='separator'></div>
             </div>

            );
        });

        //Setting the processed array data to the state
        this.setState({
          txEventTasks: processedTasks

        })

      }

      //Setting the processed event to the state
      this.setState({
        txEventValue: processedEvent,

      })
    }).catch(error => {

      //In case of error.
      console.log("Error:" + error.message);
      this.setState({
        isFetching: false,
        onError: true
      });

    });

  }


  //This function will get the number of blocks and draw the blocks chart
  drawChart() {
    const blockWidth= 40;
    const blockHeigth= 40;
    const blocks = this.props.data;

    //Space between blocks
    let space = blockWidth * 2;

    //Render the canvas, the width will scale according to the number of blocks
    const svg = d3.select(".blocks").append("svg")
    .attr("width", this.props.data * 80)
    .attr("height", 100);

    //for each block, draw the block figure, the line connecting them, and the lines that compose the arrows
    for (let i = 0; i < blocks; i++){

      svg.append("rect")
      .attr("x", i * space)
      .attr("y", "20")
      .attr("width", blockWidth)
      .attr("height", blockHeigth)
      .attr("id", i)
      .style("cursor", "pointer")
      .style("fill", function(d) { return "#2185d0"; })
      .style("stroke", function(d) { return d3.rgb("black").darker(); })
      .attr('stroke-width', '2')
      .attr("rx", 10)
      //When a block is clicked, call the API according to the index of the block ˇ
      .on('click', () => {
        this.getBlockRequest(i)
      });

      //Text with the block number
      svg.append('text')
      .attr("x", i * space + (blockWidth/2))
      .attr("y", "80")
      .text(i);


      //Draws the line between blocks and two small lines for the "Arrow"
      if(i < blocks - 1){
        svg.append("line")
        .attr("x1", blockWidth + space * i)
        .attr("y1", 40)
        .attr("x2", (blockWidth * 2) + space * i)
        .attr("y2", 40)
        .attr("stroke-width", 2)
        .attr("stroke", "gray");

        svg.append("line")
        .attr("x1", (blockWidth * 2) + space * i - 1)
        .attr("y1", 40)
        .attr("x2", (blockWidth * 2) + space * i - 10)
        .attr("y2", 50)
        .attr("stroke-width", 2)
        .attr("stroke", "gray");

        svg.append("line")
        .attr("x1", (blockWidth * 2) + space * i - 1)
        .attr("y1", 40)
        .attr("x2", (blockWidth * 2) + space * i - 10)
        .attr("y2", 30)
        .attr("stroke-width", 2)
        .attr("stroke", "gray");
      }
    }
  }

  render(){

    if (this.state.isFetching) {
      return(
        <Loader active={true} />
      )
    }else {
      if (this.state.blockDetail != null) {
        return (
          <div>
            <div className="wrapper">
              <div className="scrolls">
                <div className="blocks">
                </div>
              </div>
            </div>
            <div className='separator'></div>
            <List style={{ "textAlign": "left"}}>
              <List.Item>
                <List.Header>Block Number</List.Header>
                {this.state.blockNumber}
              </List.Item>
              <List.Item>
                <List.Header>Block Transaction ID</List.Header>
                <a onClick={() => {this.getTxDetailsRequest(this.state.blockTxID)} }>{this.state.blockTxID}</a>
              </List.Item>
              <List.Item>
                <List.Header>Block Previous Hash</List.Header>
                {this.state.blockPrevHash}
              </List.Item>
              <List.Item>
                <List.Header>Block Data Hash</List.Header>
                {this.state.blockDataHash}
              </List.Item>
              <List.Item>
                <List.Header>Block Timestamp</List.Header>
                {this.state.blockTimestamp}
              </List.Item>
            </List>
            <div className='separator'></div>
            {this.state.transactionDetail
              ?
              <div>
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
      }else{
        return (
          <div className="wrapper">
            <div className="scrolls">
              <div className="blocks">
              </div>
            </div>
          </div>
        )
      }

    }
  }
}

export default Chart;
