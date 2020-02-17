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
			state: 0
		}

		this.getAccountData = this.getAccountData.bind(this)
		this.postAccountData = this.postAccountData.bind(this)
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

	getAccountData = childState => {
		console.log(`account-settings: account setting callback with ${childState.account.name}`)
		this.setState({
			account: childState.account,
			token: childState.token,
			state: 2,
		})
		this.props.setAccount(this.state.account)
	} 	

	postAccountData = data => {
    	//fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/account`, {
		fetch(`http://localhost:8080/api/account`, {
    		method: 'POST',
    		headers: {
				"Accept": "application/json",
        		"Content-Type": "application/json",
				"X-AUTH": "NONE"
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
				{/*<div id="accountPicture" style={{backgroundImage: `url('data:image/jpeg;base64,${this.state.account.picture}')`}}>
				</div>*/}
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
										this.postAccountData({"name": this.state.account.name})
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
			<Login callback={this.getAccountData}/>
		}
		</div>
	)
	}
}

export default Main;
