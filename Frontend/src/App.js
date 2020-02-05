import React, {Component} from 'react';
import logo from './logo.svg';
import Listings from './bounty-listings';
import Map from './map';
import Menu from './menu';
//import { process } from 'dotenv';
import './App.css';

class App extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div id="overlay">
	 	<Map/>
        <Menu/>
      </div>
    )
  }
}

export default App;
