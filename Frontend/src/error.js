import React, {Component} from 'react';
import './splash.css'
//import './App.css';

const Main = props => {
	let renderMessage = (props.msg !== undefined || props.msg !== "")
	return (
      	<div id="splashContainer">
	  		<div id="errorSplash"><h1>!</h1><p>
				  {renderMessage && props.msg}
				  {!renderMessage && "Something went wrong!"}
			</p></div>
      	</div>
    )
}

export default Main;
