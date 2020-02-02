import React, {Component} from 'react';
import {Loader, LoaderOptions} from 'google-maps';
//import './App.css';

class Map extends Component{
  constructor(props){
    super(props)
    this.state = {
      viewCard: undefined,
      listings: []
    }

    this.init_map = this.init_map.bind(this)
    this.render_bounty = this.render_bounty.bind(this)
    const options: LoaderOptions = {/* todo */};
    this.loader = new Loader("AIzaSyA8VNUu-pbN6gSNsc1ayzYEaL5xjIshEOI", options);

  }

  componentDidMount() {
    this.loader.load().then(google => {
      this.setState({
        google: google,
        map : new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.8995914, lng: -77.0679584},
          zoom: 15,
        })
      })
    })

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
          listings: json
      });
    })
    .then(json => this.init_map())
    .catch(err => {
      console.log('caught it!',err);
    })
    
  } 

  init_map = () => {
    this.state.listings.forEach((entry, i) => {
        let marker = new this.state.google.maps.Marker({
          map: this.state.map,
          draggable: false,
          position: {
            lat: entry.location.lat, 
            lng: entry.location.lng
          }
        })
        
        this.state.google.maps.event.addListener(marker, 'click', this.render_bounty(entry))
      }
    )
  }

  render_bounty = bounty => {
    const _bounty = bounty
    return () => {
      let _id = _bounty._id['$oid']
      console.log(`bounty id: ${_id}`)
      fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/bounty/${_id}`, {
        method: 'GET',
        headers: {
          "Accept": "application/json",
        }
      })
      .then(res => res.json())
      .then(res => this.setState({viewCard: res}))
      //.then(res => console.log(`${res.text()}`))
      .catch(err => console.log(`Error on getting bounty: ${err}`))
    }
  }

  render(){
    return (
      <div id="viewContainer">
      	<div id="map"> 
          {/*this.map()*/}
        </div>
        {this.state.viewCard !== undefined &&
          <div id="viewCard">
            <div id="viewCardImage" style={{backgroundImage: `url('data:image/jpeg;base64,${this.state.viewCard.img}')`}}></div>
            <h2>{this.state.viewCard.name}</h2>
            <h3><b>${this.state.viewCard.price}</b></h3>
            <p><i>{this.state.viewCard.state}</i></p>
            <p>{this.state.viewCard.desc}</p>
            <button>Accept</button>
          </div>
        }
      </div>
    )
  }
}

export default Map;
