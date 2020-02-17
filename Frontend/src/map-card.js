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
							<button id="viewCardAccept" class="ButtonEnabled" onClick={() => this.accept_bounty(this.state.card._id)}>Accept</button>}
						{this.state.card.state === "taken" && 
							<button id="viewCardAccept" class="ButtonDisabled">Accept</button>}
					</div>
				}
			</div>
		)
	}
}

export default Main;
