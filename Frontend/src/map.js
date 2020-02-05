import React, {Component} from 'react';
import {Loader, LoaderOptions} from 'google-maps';
import MapIcon from './icon.svg'
import AddBountyLogo from "./Logo1+AddBounty_.svg";
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
    this.accept_bounty = this.accept_bounty.bind(this)
    const options: LoaderOptions = {/* todo */}
	this.loader = new Loader(`${process.env.REACT_APP_MAP_API_KEY}`, options)

  }

  componentDidMount() {
    this.loader.load().then(google => {
      this.setState({
        google: google,
        map : new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.8995914, lng: -77.0679584},
          zoom: 15,
          scaleControl: false,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
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
        let icon = {
            url: MapIcon,
            size: this.state.google.maps.Size(5, 5),
            scaledSize: this.state.google.maps.Size(25, 25),
            origin: this.state.google.maps.Point(0, 0),
            anchor: this.state.google.maps.Point(17, 34),
          }
        let marker = new this.state.google.maps.Marker({
          map: this.state.map,
          draggable: false,
          position: {
            lat: entry.location.lat, 
            lng: entry.location.lng
          },
          icon: icon

        })
        
        this.state.google.maps.event.addListener(marker, 'click', this.render_bounty(entry))
      }
    )
  }

  accept_bounty = _id => {
    let id = _id["$oid"]
    console.log(id)
    fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/bounty/${id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"state":"taken"})
    })
    .then(res => res.json())
    .then(res => this.setState({viewCard: res}))
    .then(res => {
      fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/bounty/${id}`, {
        method: 'GET',
        headers: {
          "Accept": "application/json",
        }
      })
      .then(res => res.json())
      .then(res => this.setState({viewCard: res}))
      //.then(res => console.log(`${res.text()}`))
      .catch(err => console.log(`Error on getting bounty: ${err}`))
    })
    //.then(res => console.log(`${res.text()}`))
    .catch(err => console.log(`Error on getting bounty: ${err}`))
    
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
            {this.state.viewCard.state === "untaken" && 
              <button id="viewCardAcceptEnabled" onClick={() => this.accept_bounty(this.state.viewCard._id)}>Accept</button>}
            {this.state.viewCard.state === "taken" && 
              <button id="viewCardAcceptDisabled" onClick={() => this.accept_bounty(this.state.viewCard._id)}>Accept</button>}
          </div>
        }
      </div>
    )
  }
}

export default Map;
