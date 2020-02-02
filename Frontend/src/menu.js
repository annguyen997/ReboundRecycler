import React, {Component} from 'react';

class Menu extends Component{
  constructor(props){
    super(props)

  }

  render(){
    return (
      	<div id="menu"> 
          <a href="http://hmpg.net" id="menu_item">
            <p>profile</p>
          </a>
          <a id="menu_item">
            <p>search</p>
          </a>
          <a id="menu_center">
            +
          </a>
          <a id="menu_item">
            <p>about</p>
          </a>
          <a id="menu_item">
            <p>contact us</p>
          </a>
        </div>
      )
  }
}

export default Menu;
