import React, { Component } from 'react';

class AuthScreen extends Component {

   state = {
      loginMode: true
   }

   changeMode=()=>{
      this.setState(({loginMode})=>{
         return {loginMode: !loginMode}
      })
   }

   render() {
      return (
         <div class="auth">
         <div class={`my-card ${this.state.loginMode ? '' : 'do-flip'}`}>
           <div class="my-card__face my-card__face--front auth__elem">
             <p class="auth__title">Log in</p>
             <form action="" class="auth__form">
               <div class="auth__input">
                 <label className='auth__field-title'>login or email</label>
                 <input type="text" className='auth__field'/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field'/>
               </div>
               <div className="auth__submit-line">
                  <p className="auth__link" onClick={this.changeMode}>Create an account</p>
                  <button className="btn btn-primary auth__submit">Log in</button>
               </div>

             </form>
           </div>
           <div class="my-card__face my-card__face--back auth__elem">
             <p class="auth__title">Sign in</p>
             <form action="" class="auth__form">
               <div class="auth__input">
                 <label className='auth__field-title'>email</label>
                 <input type="text" className='auth__field'/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>login</label>
                 <input type="text" className='auth__field'/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field'/>
               </div>
               <div className="auth__submit-line">
               <p className="auth__link" onClick={this.changeMode}>Already have an account</p>
                  <button className="btn btn-primary auth__submit">Sign in</button>
               </div>
             </form>
           </div>
         </div>
       </div>
      );
   }
}

export default AuthScreen;