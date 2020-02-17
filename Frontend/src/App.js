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
		token: cookie.load("token")
	}
	this.setAccount = this.setAccount.bind(this)
  }

  setAccount = account => {
	console.log(`App.js: Account setting callback with ${account.name}`)
	this.setState({
		account: account
	})
  }

  setToken = token => {
	console.log(`App.js: Token setting callback with ${token}`)
	this.setState({
		token: token
	})
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
					<Account setAccount={this.setAccount}/>
				</Route>
				<Route path="/logout">
					<Logout setAccount={this.setAccount} setToken={this.setToken}/>
				</Route>
				<Route path="/">
	 				<Map/>
				</Route>
			</Switch>
        	<Menu account={this.state.account}/>
		</Router>
      </div>
    )
  }
}

export default App;
