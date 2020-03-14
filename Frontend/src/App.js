import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import cookie from 'react-cookies'
import Logout from './logout'
import Account from './account-settings'
import Listings from './bounty-listings'
import Map from './map'
import Menu from './menu'
//import { process } from 'dotenv';
import './App.css'

class App extends Component{
	constructor(props){
		super(props)
		this.state = {
			account: cookie.load("account"),
			thumbnail: "",
			token: cookie.load("token"),
		}
		this.setAccount = this.setAccount.bind(this)
		this.setToken = this.setToken.bind(this)
		this.getAccountThumbnail = this.getAccountThumbnail.bind(this)
	}

	componentDidMount(){
		this.getAccountThumbnail()
	}

	setAccount = account => {
		console.log(`App: Account setting callback with ${account}`)
		this.setState({
			account: account
		})

		if(account !== undefined){
			cookie.save("account", JSON.stringify(this.state.account))
			this.getAccountThumbnail()
		}else{
			cookie.remove("account")
		}
  	}

  	setToken = token => {
		console.log(`App: Token setting callback with ${token}`)
		this.setState({
			token: token
		})

		if(token !== undefined){
			cookie.save("token", this.state.token)
		}else{
			cookie.remove("token")
		}
	}

	getAccountThumbnail = () => {
		if(this.state.account !== undefined && this.state.account !== {} && this.state.account._id !== undefined){
			fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/account/thumbnail/${this.state.account._id["$oid"]}`, {
				method: 'GET',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"X-AUTH": this.state.token
				}
			})
			.then(res => res.text())
			.then(res => {console.log(`menu: got account thumbnail`);return res;})
			.then(res => {
				this.setState({
					thumbnail: res,
					picture_state: 2,
				})
			})
			.catch(err => {
				console.log('caught it!',err)
				this.setState({
					errorMsg: err.message,
					thumbnail: "",
					picture_state: -1,
				})
			})
		}else{
			console.error(`App: account object lacks "_id" property, it is not legitimate`)
			this.setToken(undefined)
			this.setAccount(undefined)
		}
	}

	render(){
	return (
		<div id="overlay">
			<Router>
				<Switch>
					<Route path="/listings">
						<Listings/>
					</Route>
					<Route path="/account">
						<Account account={this.state.account} setAccount={this.setAccount} token={this.state.token} setToken={this.setToken}/>
					</Route>
					<Route path="/logout">
						<Logout account={this.state.account} setAccount={this.setAccount} token={this.state.token} setToken={this.setToken}/>
					</Route>
					<Route path="/">
						<Map/>
					</Route>
				</Switch>
				<Menu account={this.state.account} thumbnail={this.state.thumbnail}/>
			</Router>
		</div>
	)
	}
}

export default App;
