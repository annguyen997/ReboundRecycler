import React, { Component } from 'react'
import Loading from './loader'
import Error from './error'
import CreateAccount from './create-account'
import './login.css'

class Main extends Component{
	constructor(props){
    	super(props)
    	this.state = {
			state: 2,
    	}
	
		this.login = this.login.bind(this)
		this.sendAuthRequest = this.sendAuthRequest.bind(this)
		this.getAccountData = this.getAccountData.bind(this)
  	}

	componentDidMount() {
	  	if(this.props.token !== undefined && this.props.account !== undefined){
			this.setState({
				state: 3
			})
			console.log("calling back after no action")
			this.props.setLoggedIn()
		}
	}

	login = async () => {
		console.log("sending auth request")
		this.setState({
			state: 1
		})
		let token = await this.sendAuthRequest(`${this.state.username}:${this.state.password}`)
		if(token !== undefined){
			if(await this.getAccountData(token) !== undefined){
				this.props.setLoggedIn()
			}else{
				console.log(`login: Did not set user as logged in, getAccountData returned undefined`)
			}
		}
	}

	sendAuthRequest = authString => {
    	return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/auth`, {
    		method: 'GET',
			headers: {
        		"Content-Type": "application/json",
				"Authorization": `Basic ${Buffer.from(authString).toString("base64")}`
    		}
    	})
    	.then(res => res.json())
    	.then(json => {
			if("token" in json && json.token !== "None"){
				this.props.setToken(json.token)
				return json.token
			}else{
				this.setState({
					state: 2,
					failMsg: "Invalid Credentials"
				})
				return undefined
			}
    	})
    	.catch(err => {
			console.log('caught it!',err)
      		this.setState({
				errorMsg: err.message,
				state: 0,
				token: undefined,
			})
			return undefined
    	})
	} 

	getAccountData = token => {
		return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/account`, {
			method: 'GET',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-AUTH": token
			}
		})
		.then(res => res.json())
		.then(account => {
			this.setState({
				state: 3
			})
			this.props.setAccount(account)
			return account
		})
		.catch(err => {
			console.log('login error',err)
			this.setState({
				errorMsg: err.message,
				account:  undefined,
				state: 0,
			})
			return undefined
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
					<div id="loginCard">
						<input 
							id="usernameField"
							onChange = {e => {
								this.setState({
									username: e.target.value
								})
							}}
							placeholder="username"
						/>
						<input 
							type="password"
							id="passwordField"
							onChange = {e => {
								this.setState({
									password: e.target.value
								})
							}}
							placeholder="secret sauce"
						/>
						<div id="loginMessage"><p>{this.state.failMsg}</p></div>
						<div id="submitFields">
							<button id="createAccountButton" onClick={() => this.setState({state: 3})}>sign up</button>
							<button id="loginButton" onClick={this.login}>login</button>
						</div>
					</div>}
				{this.state.state === 3 &&
					<CreateAccount callback={() => this.setState({state: 2})}/>}
      		</div>
    	)
  	}
}

export default Main;
