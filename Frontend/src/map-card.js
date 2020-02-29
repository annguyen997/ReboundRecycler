import React, {Component} from 'react';
import Loading from './loader'
import Error from './error'

class Main extends Component{
	_isMounted = false

	constructor(props){
		super(props)
		this.state = {
			url: props.url,
			state: 0,
			card: undefined,
			err: undefined
		}


		this.accept_bounty = this.accept_bounty.bind(this) 
	}

	componentDidMount() {
		console.log(`bounty id: ${this.state.url}`)
		this._isMounted = true
		this.setState({
			state: 1
		})
		fetch(this.state.url, {
			method: 'GET',
			headers: {
			"Accept": "application/json",
			}
		})
		.then(res => res.json())
		.then(res => {
			if(this._isMounted){
				this.setState({
					state: 2,
					card: res
				})
			}
		})
		.catch(err => {
			console.log(`Error on getting bounty: ${err}`)
			this.setState({
				state: 0,
				err: err
			})
		})
	} 

	componentWillUnmount() {
		this._isMounted = false;
	}

	accept_bounty = _id => {
		let id = _id["$oid"]
		console.log(id)
		fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/bounty/${id}`, {
			method: 'post',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({"state":"taken"})
		})
		.then(res => res.json())
		.then(res => this.setState({viewCard: res}))
		.then(res => {
		  fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/bounty/${id}`, {
			method: 'GET',
			headers: {
			  "Accept": "application/json",
			}
		  })
		  .then(res => res.json())
		  .then(res => this.setState({viewCard: res}))
		  .catch(err => console.log(`Error on getting bounty: ${err}`))
		})
		.catch(err => console.log(`Error on getting bounty: ${err}`))
	}
	
	render(){
		return (
			<div id="viewCard">
				{this.state.state === 0 &&
					<Error msg={this.state.err}/>}
				{this.state.state === 1 &&
					<Loading/>}
				{this.state.state === 2 && this._isMounted &&
					<div id="innerViewCard">
						<div id="viewCardImage" style={{backgroundImage: `url('data:image/jpeg;base64,${this.state.card.img}')`}}></div>
						<h2>{this.state.card.name}</h2>
						<h3><b>${this.state.card.price}</b> &bull; <i>{this.state.card.state}</i></h3>
						<p>{this.state.card.desc}</p>
						{this.state.card.state === "untaken" && 
							<button id="viewCardAccept" className="ButtonEnabled" onClick={() => this.accept_bounty(this.state.card._id)}>Accept</button>}
						{this.state.card.state === "taken" && 
							<button id="viewCardAccept" className="ButtonDisabled">Accept</button>}
					</div>
				}
			</div>
		)
	}
}

export default Main;
