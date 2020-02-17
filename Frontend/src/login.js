import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import cookie from 'react-cookies'
import Loading from './loader'
import Error from './error'
import './login.css';

class Main extends Component{
	constructor(props){
    	super(props)
    	this.state = {
			token: cookie.load("token"),
			account: cookie.load("account"),
			state: 2
    	}
	
		this.sendAuthRequest = this.sendAuthRequest.bind(this)
		this.getAccountData = this.getAccountData.bind(this)
  	}

	componentDidMount() {
	  	if(this.state.token !== undefined){
			if(this.state.account !== undefined){
				this.setState({
					state: 3
				})
				console.log("calling back after no action")
				this.props.callback(this.state)
			}else{
				console.log("getting account")
				this.getAccountData(this.state.token)
			}
		}
	}

	sendAuthRequest = () => {
		console.log("sending auth request")
		this.setState({
			state: 1
		})
		let authString = `${this.state.username}:${this.state.password}`
    	//fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/auth`, {
    	fetch(`http://localhost:8080/api/auth`, {
    		method: 'GET',
			headers: {
        		"Content-Type": "application/json",
				"Authorization": `Basic ${Buffer.from(authString).toString("base64")}`
    		}
    	})
    	.then(res => res.json())
    	.then(json => {
			if("token" in json && json.token !== "None"){
      			this.setState({
						token:  json.token,
						//state: 3
      			})
				//this.props.tokenCallback(this.state.token)
				cookie.save("token", json.token)
				this.getAccountData(json.token)
			}else{
				this.setState({
					token: undefined,
					state: 2,
					failMsg: "Invalid Credentials"
				})
			}
    	})
    	.catch(err => {
			console.log('caught it!',err)
      		this.setState({
				errorMsg: err.message,
				state: 0,
				token: undefined,
      		})
    	})
	} 

	getAccountData = token => {
		console.log("getting account data")
		this.setState({
			state: 1
		})
		//fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/account`, {
		fetch(`http://localhost:8080/api/account`, {
			method: 'GET',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-AUTH": token
			}
		})
		.then(res => res.json())
		.then(json => {
			this.setState({
				account:  json,
				state: 3
			})
			cookie.save("account", JSON.stringify(this.state.account))
			this.props.callback(this.state)
		})
		//.then(this.props.tokenCallback())
		.catch(err => {
			console.log('login error',err)
			this.setState({
				errorMsg: err.message,
				account:  undefined,
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
						<button id="loginButton" onClick={this.sendAuthRequest}>login</button>
						{/*<p>{this.state.failMsg}</p>*/}
					</div>}
      		</div>
    	)
  	}
}

export default Main;
