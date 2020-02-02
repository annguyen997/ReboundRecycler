import React, {Component} from 'react';
import logo from './logo.svg';
import Listings from './bounty-listings';
import Map from './map';
import './App.css';

class App extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div id="overlay">
	  	<Map/>
		<Listings/>
        <div id ="overlay-border">
        </div>
        <p className= "opaque-text"> Rebound </p>
      </div>
      )
  }
}

export default App;
