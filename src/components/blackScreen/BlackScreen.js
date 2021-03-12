import React, { Component } from 'react';
import $ from 'jquery';

class BlackScreen extends Component {
   elem = React.createRef();

   componentDidUpdate(){
      let {isSideMenuOpen} = this.props.elements
      isSideMenuOpen ? $(this.elem.current).fadeIn() : $(this.elem.current).fadeOut();
   }

   render() {
      return (
         <div class='black-screen' ref={this.elem}></div>
      )
   }
}

export default BlackScreen;