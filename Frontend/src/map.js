import React, {Component} from 'react'
import {Loader, LoaderOptions} from 'google-maps'
import MapCard from './map-card'
import MapIcon from './icon.svg'
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
    const options: LoaderOptions = {/* todo */}
	  this.loader = new Loader(`${process.env.REACT_APP_MAP_API_KEY}`, options)
  }

  componentDidMount() {
    let mapPromise = this.loader.load().then(google => {
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

    let dataPromise = fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/bounties/map`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState({
          listings: json
      });
    })
    .catch(err => {
      console.log('caught it!',err);
    })
    

	Promise.all([mapPromise, dataPromise])
    .then(json => this.init_map())
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


  render_bounty = bounty => {
    const _bounty = bounty
    return () => {
      this.setState({
        renderViewCard: false
      })
      
      let _id = _bounty._id['$oid']

      this.setState({
        renderViewCard: true,
        cardUrl: `${process.env.REACT_APP_REST_ENDPOINT}/api/bounty/${_id}`
      })
    }
  }

  render(){
    return (
      <div id="viewContainer">
      	<div id="map"></div>
        {this.state.renderViewCard === true &&
			    <MapCard url={this.state.cardUrl} />
        }
      </div>
    )
  }
}

export default Map;
