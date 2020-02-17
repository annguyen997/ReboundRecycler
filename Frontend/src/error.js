import React, {Component} from 'react';
import './splash.css'
//import './App.css';

class Main extends Component{
  constructor(props){
    super(props)
	console.log(props)
    this.state = {
		msg: props.msg
	}

  }

  componentDidMount() {
  	if(this.state.msg === "" || this.state.msg === undefined){
		this.setState({
			msg: "Something went wrong!"
		})
	}
  } 

  render(){
    return (
      <div id="splashContainer">
	  	<div id="errorSplash"><h1>!</h1><p>{this.state.msg}</p></div>
      </div>
    )
  }
}

export default Main;
