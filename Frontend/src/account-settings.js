import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import cookie from 'react-cookies'
import Login from './login'
import Loading from './loader'
import Error from './error'
import './account-settings.css'

class Main extends Component{
	constructor(props){
		super(props)
		this.state = {
			token: cookie.load('token'),
			account: cookie.load('account'),
			picture: "",
			state: 0,
			picture_state: 0,
		}

		this.setLoggedIn = this.setLoggedIn.bind(this)
		this.setToken = this.setToken.bind(this)
		this.setAccount = this.setAccount.bind(this)
		this.getAccountPicture = this.getAccountPicture.bind(this)
		this.postAccountName = this.postAccountName.bind(this)
		this.editField = this.editField.bind(this)
	}

	componentDidMount() {
		if(this.state.token === undefined || this.state.account === undefined){
			console.log('Requesting login')
			this.setState({
				state: 3
			})
		}else{
			this.setState({
				state: 3
			})
		}
	}

	setLoggedIn = () => {
		console.log(`account-settings: login callback`)
		if(this.props.token !== undefined && this.props.account !== undefined){
			this.setState({
				state: 2,
				account: this.props.account //TODO: Make sure this doesn't come back to bite you!
			})
			this.getAccountPicture()
		}
	}

	setToken = token => {
		console.log(`account-settings: token setting callback`)
		this.props.setToken(token)
	}

	setAccount = account => {
		console.log(`account-settings: account setting callback`)
		this.props.setAccount(account)
	} 	

	getAccountPicture = () => {
		fetch(`${process.env.REACT_APP_REST_ENDPOINT}/api/account/picture/${this.state.account._id["$oid"]}`, {
    		method: 'GET',
    		headers: {
				"Accept": "application/json",
        		"Content-Type": "application/json",
				"X-AUTH": this.props.token
      		}
    	})
		.then(res => res.text())
		.then(res => {console.log(`account-settings: got account picture`);return res;})
		.then(res => {
			this.setState({
				picture: res,
				picture_state: 2,
			})
		})
		.catch(err => {
			console.log('caught it!',err)
			this.setState({
				errorMsg: err.message,
				//account:  undefined,
				picture_state: -1,
				editName: false,
				editBio: false,
			})
		})
	}

	postAccountName = data => {
		//fetch(`http://localhost:8080/api/account/name`, {
    	fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/account/name`, {
    		method: 'POST',
    		headers: {
				"Accept": "application/json",
        		"Content-Type": "application/json",
				"X-AUTH": this.props.token
      		}
    	})
		.then(res => res.json())
		.then(res => {console.log(res);return res;})
		.then(json => {
			this.setState({
				account:  json,
				state: 2,
			})
		})
		.catch(err => {
			console.log('caught it!',err)
			this.setState({
				errorMsg: err.message,
				account:  undefined,
				state: -1,
				editName: false,
				editBio: false,
			})
		})
  	}

	editField = _fieldName => {
		console.log("hi?")
		const fieldName = _fieldName
		return () => {
			ReactDOM.render(<input id="editor"></input>, document.getElementById(fieldName))
		}
	}

	render(){
	return (
		<div id="viewContainer" className="naturey">
		{this.state.state === -1 &&
			<Error msg={this.state.errorMsg}/>
		}
		{this.state.state === 1 &&
			<Loading/>
		}
		{this.state.state === 2 &&
			<div id="accountCard">
				<div id="accountPicture" style={{backgroundImage: `url(${this.state.picture})`}}>
				</div>
				<div id="accountDetails">
					{!this.state.editName &&
						<div id="accountName">
							<h1 id="nameH1">{this.state.account.name}</h1>
							<button className="editField" onClick={() => {this.setState({editName: true})}}>edit</button>
						</div>}
					{this.state.editName &&
						<div id="accountName">
							<input id="edit_accountName"/>
							<button 
								className="saveField" 
								onClick={
									() => {
										this.postAccountName({"name": this.state.account.name})
										this.setState({editName: false})
									}
								}
							>
								edit
							</button>
						</div>}
					{!this.state.editBio &&
						<div id="accountDesc">
							<p>{this.state.account.bio}</p>
							<button className="editField" onClick={() => {this.setState({editBio: true})}}>edit</button>
						</div>}
					{this.state.editBio &&
						<div id="accountBio">
							<input id="edit_accountBio"/>
						</div>}
				</div>	
			</div>
		}
		{this.state.state === 3 && 
			<Login account={this.props.account} setAccount={this.setAccount} token={this.props.token} setToken={this.setToken} setLoggedIn={this.setLoggedIn}/>
		}
		</div>
	)
	}
}

export default Main;
