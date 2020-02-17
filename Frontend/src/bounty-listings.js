import React, { Component } from 'react';
import Loading from './loader';
import Error from './error';
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
		fetch("https://test-b4gvhsdddq-uc.a.run.app/api/bounties/listings", {
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
			this.setState({
					renderState: 0
			})
			console.log('caught it!',err);
		})
		
	}	

	renderListings = data => {
		let elements = []
		data.forEach((entry, key) => {
			let element = (
				<div key={key} id="card">
					<div id="listingCardImage" style={{backgroundImage: `/*linear-gradient(to left, white, transparent),*/ url('data:image/jpeg;base64,${entry.img}')`}}></div>
					<div id="listingText">
						<h2>{entry.name}</h2>
						<p>{entry.price} &bull; {entry.state}</p>
						<p>{entry.desc}</p>
					</div>
					<div id="listingButton">
						{entry.state === "untaken" && 
							<button id="listingCardAccept" class="ButtonEnabled">Accept</button>}
						{entry.state === "taken" && 
							<button id="listingCardAccept" class="ButtonDisabled">Accept</button>}
					</div>
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
					<Error/>
				}
				{this.state.renderState === 1 && 
					<Loading/>
				}
				{this.state.renderState === 2 && 
					<div id="listingsFrame">{this.state.listings}</div>
				}
	  		</div>
		);
	}
}

export default Listings;
