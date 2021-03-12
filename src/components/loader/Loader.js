import React, { Component } from 'react';
import './spinner.scss';

class Loader extends Component {
   render() {
      let {state, message} = this.props;
      if(state){
         return (
            <div class="loader">
               <div className='loader__screen'></div>
               <div class='loader__modal modal'>
                  <div class="loader__loader"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
                  <p class="loader__info">{message}...</p>
               </div>
             </div>
            );
      } else{
         return null
      }
   }
}

export default Loader;