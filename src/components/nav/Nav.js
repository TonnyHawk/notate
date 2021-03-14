import React, { Component } from 'react';

class Nav extends Component {

   navBar = React.createRef();

   toggleNavbar=()=>{
      this.navBar.current.classList.toggle('is-expanded')
   }

   render() {
      return (
      <div className="nav container-lg" ref={this.navBar}>
         <div className="nav__menu-btn" onClick={()=>this.props.toggleElement('side-menu')}>
           <div className="hamburger hamburger--empatic">
             <div className="hamburger-box">
                <div className="hamburger-inner"></div>
             </div>
          </div>
         </div>
         <div className="nav__search-btn" onClick={this.toggleNavbar}>
           <i className="fas fa-search"></i>
         </div>
         <p className="nav__logo">notate.io</p>
         <form className="nav__search">
            <input 
               type="text" placeholder="Search..." 
               value={this.props.searchState}
               name='search'
               ref={this.searchField}
               onChange={this.props.doSearch}/></form>
       </div>
      );
   }
}

export default Nav;