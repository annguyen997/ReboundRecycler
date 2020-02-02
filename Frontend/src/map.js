import React, {Component} from 'react';
import {Loader, LoaderOptions} from 'google-maps';
//import './App.css';

class Map extends Component{
  constructor(props){
    super(props)
    this.state = {
      renderState: 0,
      listings: []
    }

    this.map = this.map.bind(this)

    const options: LoaderOptions = {/* todo */};
    this.loader = new Loader(null, options);

  }

  componentDidMount() {
    this.setState({renderState: 1})
    fetch("https://test-b4gvhsdddq-uc.a.run.app/api/bounties/map", {
      method: 'GET',
      //mode: 'no-cors',
      headers: {
        "Accept": "application/json",
        //"Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState({
          renderState: 2,
          listings: json
      });
    })
    .then(x => console.log(this.state.listings))
    .catch(err => {
      this.setState({renderState: 0})
      console.log('caught it!',err);
    })
    
  } 

  map = () => {
    this.loader.load().then(function (google) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12,
      });
    });
  }

  render(){
    return (
      	<div id="map"> 
          {this.map()}
        </div>
      )
  }
}

export default Map;
