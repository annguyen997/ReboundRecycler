import React, {Component} from 'react';
import logo from './logo.svg';
import map from './map';
import {Loader, LoaderOptions} from 'google-maps';
import './App.css';

class App extends Component{

  

  constructor(props){
    super(props)
    this.map = this.map.bind(this)

    const options: LoaderOptions = {/* todo */};
    this.loader = new Loader(null, options);

  }

  map = () => {
    this.loader.load().then(function (google) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
      });
    });
  }

  render(){
    return (
      <div id="overlay">
        <div id="map"> 
          {this.map()}
        </div>
        <div id ="overlay-border">
        </div>
        <p className= "opaque-text"> Rebound </p>
      </div>
      )
  }
}

export default App;
