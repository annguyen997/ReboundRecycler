import React, { Component } from 'react';
import fetch from 'node-fetch';

class Listings extends Component {
	constructor(props){
		super(props)
		this.state = {
			renderState: 0,
			listings: []
		}

		this.renderListings = this.renderListings.bind(this)
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
					listings: this.renderListings(json)
			});
		})
		.then(x => console.log(this.state.listings))
		.catch(err => {
			this.setState({renderState: 0})
			console.log('caught it!',err);
		})
		
	}	

	renderListings = data => {
		let elements = []
		data.forEach((entry, key) => {
			let element = (
				<div key={key} id="card">
					<h2>{entry.name}</h2>
					<p><i>lng: </i>{entry.location.lng}  <i>lat: </i>{entry.location.lat}</p>
				</div>
			)
			elements.push(element)
		})
		return elements
	}

	render(){
		return (
			<div id="listings">
				{this.state.renderState === 0 && 
					<p>Error</p>
				}
				{this.state.renderState === 1 && 
					<p>Loading</p>
				}
				{this.state.renderState === 2 && 
					<div>{this.state.listings}</div>
				}
	  		</div>
		);
	}
}

export default Listings;
