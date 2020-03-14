import React, {Component} from 'react'
//import cookie from 'react-cookies'
import './menu.css'
import AddBountyLogo from "./Logo1+AddBounty_.svg"

class Menu extends Component{
	constructor(props){
		super(props)
		this.state = {
			thumbnail: "",
			picture_state: 0
		}
	}

	/*componentDidMount(){
		if(this.props.account !== undefined){
			this.getAccountThumbnail()
		}
	}*/

	render(){
		return (
      		<div id="menu"> 
        		<a href="/" className="menu_item">
        			<p>Map</p>
        		</a>
				<a href="/listings" className="menu_item">
					<p>Search</p>
				</a>
				<a href="/new-bounty" id="menu_center">
					<img src={AddBountyLogo} alt="+"/>
				</a>
				<a href="/" className="menu_item">
					<p>About</p>
				</a>
				{this.props.account === undefined &&
					<a href="/account" className="menu_item">
						<p>Sign In</p>
					</a>}
				{this.props.account !== undefined &&
					<div className="menu_item" id="menu_element_parent">
						<a href="/account" id="menu_account">
							<div id="menu_thumbnail" style={{backgroundImage: `url(${this.props.thumbnail})`}}/>
							<p id="menu_account_name">{this.props.account.name}</p>
						</a>
						<a href="/logout" id="menu_logout">
							<p>x</p>
						</a>
					</div>}
        	</div>
    	)
	}
}

export default Menu;
