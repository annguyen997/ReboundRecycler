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
		//fetch("https://test-b4gvhsdddq-uc.a.run.app/api/bounties/map", {
		fetch("http://10.150.242.189:8080/api/bounties/map", {
			method: 'GET',
			//mode: 'no-cors',
			headers: {
				"Accept": "application/json",
				//"Content-Type": "application/json"
			}
		})
		//.then(res => res.json())
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

	renderListings = () => {
		return (<p>listings!</p>);
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
					<div>{this.renderListings()}</div>
				}
	  		</div>
		);
	}
}

export default Listings;
