//Home tab page
import React, { Component } from 'react';
import '../Styles/Projects.css';
import chainGetInteraction from '../Services/chain_get_interaction.js';
import { List, Button } from 'semantic-ui-react';


//This component show the list os current projects available
class Projects extends Component {

  constructor() {
    super();
    this.state = {
      requestStatus: null,
      getResponse: null

    };
  }

  //As soon as the component renders, query the API to get the number of blocks.
  componentDidMount(){
   this.getLedgerStates();

  }

  //This will push the next routing page on the path of the browser.
  nextPath(path) {
    this.props.history.push('/projects/' + path);
  }

  getLedgerStates = () => {

    chainGetInteraction.chainGetInteractionService('getAllHistory', null, null).then((chainResponse) => {
      /*The response for this requests is an array, that means we must map the content so we can return
      list elements*/

      const transformedData =  chainResponse.data.map((record, i) => {
         return (
           <div key={i}>
             <List>
                <List.Item>
                  <List.Header>Project Name:</List.Header>
                  {record.Key}
                </List.Item>
                 <List.Item>
                   <List.Header>Project Description:</List.Header>
                   {record.Record.description}
                 </List.Item>
                 <List.Item>
                    <List.Header>Project Created at:</List.Header>
                    {record.Record.timestamp}
                 </List.Item>
             </List>
             <Button primary onClick={ () => {
               this.nextPath(record.Key)
             } } >View Details</Button>
             <div className='separator'></div>
           </div>
          );
      });

      this.setState({
        requestStatus : chainResponse.status,
        getResponse : transformedData
      });

    }).catch(error => {

      //If an error occurs, show it on console.
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
            {this.state.getResponse}
          </div>

      );
  }
}

export default Projects;
