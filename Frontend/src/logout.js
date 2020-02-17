import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import { Redirect,
    useHistory,
    useLocation } from 'react-router-dom';
import cookie from 'react-cookies'
import Loading from './loader'
import Error from './error'
import './login.css';

class Main extends Component{
	constructor(props){
    	super(props)
    	this.state = {
            state: 2
        }
  	}

	componentDidMount() {
        //fetch()
        cookie.remove("account")
        this.props.setAccount(undefined)
        cookie.remove("token")
        this.props.setToken(undefined)
	}

	render(){
    	return (
    		<div id="viewContainer" className="naturey">
	  			{this.state.state === 0 &&
					<Error msg={this.state.errorMsg}/>}
	  			{this.state.state === 1 &&
					<Loading/>}
				{this.state.state === 2 &&
					<div id>
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
