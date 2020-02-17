import React, {Component} from 'react'
//import cookie from 'react-cookies'
import AddBountyLogo from "./Logo1+AddBounty_.svg"

class Menu extends Component{
  constructor(props){
	super(props)
    this.state = {
		account: this.props.account //cookie.load("account")
    }
  }

	render(){
		return (
      		<div id="menu"> 
        		<a href="/map" id="menu_item">
        			<p>Map</p>
        		</a>
				<a href="/listings" id="menu_item">
					<p>Search</p>
				</a>
				<a href="/new-bounty" id="menu_center">
					<img src={AddBountyLogo} alt="+"/>
				</a>
				<a href="/" id="menu_item">
					<p>About</p>
				</a>
				{this.props.account === undefined &&
					<a href="/account" id="menu_item">
						<p>Sign In</p>
					</a>}
				{this.props.account !== undefined &&
					<div id="menu_account">
						<a href="/account" id="menu_item">
							<p>{this.props.account.name}</p>
						</a>
						<a href="/logout" id="menu_item">
							<p>logout</p>
						</a>
					</div>}
        	</div>
      )
  }
}

export default Menu;
