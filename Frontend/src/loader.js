import React, {Component} from 'react';
import './splash.css'
//import './App.css';

class Main extends Component{
  constructor(props){
    super(props)
    this.state = {}

  }

  componentDidMount() {} 

  render(){
    return (
      <div id="splashContainer">
	  	<div id="loadingCircle"></div>
      </div>
    )
  }
}

export default Main;
