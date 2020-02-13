//Explorer tab component
import React, { Component } from 'react';
import '../Styles/Explorer.css';
import Chart from '../Components/Chart.js'
import getChain from '../Services/get_chain.js'

class Explorer extends Component {

  constructor() {
    super();
    //Save in the state the number of blocks on the chain
    this.state = {
      serverChainLength: null,
    };
  }

  //As soon as the component renders, query the API to get the number of blocks.
  componentDidMount(){
   this.getChainRequest();

  }

  //Chain get funcion
  getChainRequest = () => {
    getChain.getChainService().then((chainInfo)  => {

      this.setState({
        serverChainLength: chainInfo.data.height.low
      });

    })
  }

  render() {
    //If state is null, show loading spinner, otherwise render the number of blocks.
    if (this.state.serverChainLength != null) {
      return (
        <div className="App">
            <Chart data={this.state.serverChainLength} />
        </div>
      );
    }else {
      return(
          <p>Loading...</p>
      )
    }

  }
}

export default Explorer;
