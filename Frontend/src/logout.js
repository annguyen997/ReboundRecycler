import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import { Redirect } from 'react-router-dom'
import Loading from './loader'
import Error from './error'
import './login.css'

class Main extends Component{
	constructor(props){
    	super(props)
    	this.state = {
            state: 0
		}
		this.sendLogoutRequest = this.sendLogoutRequest.bind(this)
  	}

	componentDidMount() {
		this.sendLogoutRequest()
		.finally(() => {
			this.props.setAccount(undefined)
			this.props.setToken(undefined)
		})
	}

	sendLogoutRequest = () => {
		this.setState({
			state: 1
		})
		//Temporary solution for CORS issue...
		//return fetch(`https://test-b4gvhsdddq-uc.a.run.app/api/auth`, {
    	return fetch(`http://localhost:8080/api/auth/logout`, {
    		method: 'GET',
			headers: {
        		"Content-Type": "application/json",
				"X-AUTH": this.props.token
    		}
    	})
    	.then(res => res.status)
    	.then(status => {
			console.log(`logout - token used was ${this.props.token}`)
			if(status === 200){
				this.setState({
					state: 2
				})
			}else{
				console.log(`Logout failure`)
				this.setState({
					//Don't show an error...
					state: 2,
					failMsg: "That wasn't supposed to happen!"
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
	}

	render(){
    	return (
    		<div id="viewContainer" className="naturey">
	  			{this.state.state === 0 &&
					<Error msg={this.state.errorMsg}/>}
	  			{this.state.state === 1 &&
					<Loading/>}
				{this.state.state === 2 &&
					<div>
                        <Redirect
                            to={{
                                pathname: "/",
                                //state: { from: location }
                            }}
                        />
					</div>}
      		</div>
    	)
  	}
}

export default Main;
