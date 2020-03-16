import React, { Component } from 'react'
import Loading from './loader'
import Error from './error'
import './create-account.css'

class Main extends Component{
	constructor(props){
    	super(props)
    	this.state = {
			state: 2,
			username: "",
			password: "",
			password_confirm: "",
			email: "",
			name: "",
			timeToUsernameCheck: 0,
			usernameAvailable: 0
    	}
		
		this.tickHandle =  undefined
		this.tickTimeToUsernameCheck = this.tickTimeToUsernameCheck.bind(this)
		this.sendCreateAccountRequest = this.sendCreateAccountRequest.bind(this)
		this.checkUsernameAvailability = this.checkUsernameAvailability.bind(this)
		this.sendCheckUsernameAvailabilityRequest = this.sendCheckUsernameAvailabilityRequest.bind(this)
  	}

	componentDidMount() {
	}

	checkUsernameAvailability = username => {
		console.log(`Initiating username check`)
		if(this.tickHandle !== undefined){
			clearInterval(this.tickHandle)
		}
		this.setState({
			timeToUsernameCheck: 1,
			username: username,
			usernameAvailable: 1
		})
		this.tickHandle = setInterval(this.tickTimeToUsernameCheck, 300)
	}

	tickTimeToUsernameCheck = () => {
		if(this.state.timeToUsernameCheck > 0){
			this.setState({
				timeToUsernameCheck: this.state.timeToUsernameCheck - 1
			})
			console.log(`Username check in: ${this.state.timeToUsernameCheck}`)
		}else{
			console.log(`Username check`)
			this.sendCheckUsernameAvailabilityRequest()
			clearInterval(this.tickHandle)
		}
	}

	sendCheckUsernameAvailabilityRequest = () => {
		let username = this.state.username
		if(username !== ""){
			console.log(`checking username ${username}`)
			fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/account/${username}/exists`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
				}
			})
			/*.then(res => res.status)
			.then(status => {
				if(this.state.username === username){
					let isAvailable = status === 404 ? 3 : 2
					this.setState({
						usernameAvailable: isAvailable,
					})
				}
			})*/
			.then(res => res.json())
			.then(json => {
				if(this.state.username === username){
					let isAvailable = json['isAvailable'] === 'available' ? 3 : 2
					this.setState({
						usernameAvailable: isAvailable,
					})
				}
			})
			.catch(err => {
				console.log('caught it!',err)
				this.setState({
					errorMsg: err.message,
					state: 0,
				})
			})
		}else{
			this.setState({
				usernameAvailable: 0,
			})
		}
	}

	sendCreateAccountRequest = () => {
		console.log(`Sending account`)
    	fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/account`, {
    		method: 'POST',
			headers: {
        		"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"username": this.state.username,
				"password": this.state.password,
				"name": this.state.name,
				"email": this.state.email
			})
    	})
    	.then(res => res.json())
    	.then(json => {
			this.setState({
				state: 2,
			})
		})
    	.catch(err => {
			console.log('caught it!',err)
      		this.setState({
				errorMsg: err.message,
				state: 0,
			})
    	})
	} 

	render(){
    	return (
    		<div id="viewContainer" className="naturey">
	  			{this.state.state === 0 &&
					<Error msg={this.state.errorMsg}/>}
	  			{this.state.state === 1 &&
					<Loading/>}
				{this.state.state === 2 &&
					<div id="createAccountCard">
						<div id="createAccountCardFields">
							<div id="leftField">
								<div id="usernameEntryContainer">
									<input 
										id="usernameEntry"
										className="textField"
										onChange = {e => {
											this.setState({
												username: e.target.value
											})
											this.checkUsernameAvailability(e.target.value)
										}}
										placeholder="username"
									/>
									<div id="usernameAvailability">
										{/*Fetch error*/}
										{this.state.usernameAvailable === -1 &&
											<p>&#9888;</p>}
										{/*No check made (for empty username field)*/}
										{this.state.usernameAvailable === 0 &&
											<p></p>}
										{/*Awaiting check*/}
										{this.state.usernameAvailable === 1 &&
											<p>&#8230;</p>}
										{/*Unavailable*/}
										{this.state.usernameAvailable === 2 &&
											<p>&#10060;</p>}
										{/*Available*/}
										{this.state.usernameAvailable === 3 &&
											<p>&#10003;</p>}
									</div>
								</div>
								<input 
									type="password"
									id="passwordEntry"
									className="textField"
									onChange = {e => {
										this.setState({
											password: e.target.value
										})
									}}
									placeholder="secret sauce"
								/>
								<input 
									type="password"
									id="passwordEntry"
									className="textField"
									onChange = {e => {
										this.setState({
											password_confirm: e.target.value
										})
									}}
									placeholder="secret sauce pt. 2"
								/>
							</div>
							<div id="rightField">
								<input 
									id="nameEntry"
									className="textField"
									onChange = {e => {
										this.setState({
											name: e.target.value
										})
									}}
									placeholder="name"
								/>
								<input 
									id="emailEntry"
									className="textField"
									onChange = {e => {
										this.setState({
											email: e.target.value
										})
									}}
									placeholder="email"
								/>
								{/*<input 
									id="passwordEntry"
									className="textField"
									onChange = {e => {
										this.setState({
											password_confirm: e.target.value
										})
									}}
									placeholder="???"
								/>*/}
							</div>
						</div>
						<div id="loginMessage"><p>{this.state.failMsg}</p></div>
						<div id="submitFields">
							<button id="backButton" onClick={this.props.callback}>go back</button>
							{this.state.usernameAvailable === 2 &&
								<button id="createAccountButton">name taken</button>}
							{this.state.usernameAvailable === 3 &&
								<button id="createAccountButton" onClick={() => this.sendCreateAccountRequest()}>sign up</button>}
						</div>
					</div>}
				{this.state.state === 3 &&
					<p>Please check your email</p>}
      		</div>
    	)
  	}
}

export default Main;
