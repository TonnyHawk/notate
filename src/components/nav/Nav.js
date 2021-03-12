import React, { Component } from 'react';

class Nav extends Component {
   render() {
      return (
      <div className="nav">
         <div className="nav__menu-btn" onClick={()=>this.props.toggleElement('side-menu')}>
           <div className="hamburger hamburger--empatic">
             <div className="hamburger-box">
                <div className="hamburger-inner"></div>
             </div>
          </div>
         </div>
         <div className="nav__search-btn">
           <i className="fas fa-search"></i>
         </div>
         <p className="nav__logo">notate.io</p>
         <form className="nav__search"><input type="text" placeholder="Search..."/></form>
       </div>
      );
   }
}

export default Nav;