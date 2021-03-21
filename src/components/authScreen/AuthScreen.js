import React, { Component } from 'react';

class AuthScreen extends Component {

   state = {
      loginMode: false,
      email: '',
      pass: ''
   }

   changeMode=()=>{
      this.setState(({loginMode})=>{
         return {loginMode: !loginMode}
      })
   }

   handleSubmit=(e)=>{
      e.preventDefault();
      let formName = e.target.name
      // this.props.toggleElement('preloader')
      let {email, pass} = this.state;
      let {registerUser, signIn} = this.props

      if(formName === 'sign_in'){
        signIn(email, pass)
      }
      else if(formName === 'sign_up'){
        registerUser(email, pass)
      }
   }

   handleChange=(e)=>{
     let key = e.target.getAttribute('name')
     let value = e.target.value
     this.setState({
       [key]: value
     })
   }

   render() {
     let {email, pass} = this.state;
      return (
         <div class={`auth ${!this.props.user ? 'is-active' : ''}`}>
         <div class={`my-card ${this.state.loginMode ? '' : 'do-flip'}`}>
           <div class="my-card__face my-card__face--front auth__elem">
             <p class="auth__title">Sign in</p>
             <form action="" name='sign_in' class="auth__form" onSubmit={this.handleSubmit}>
               <div class="auth__input">
                 <label className='auth__field-title'>login or email</label>
                 <input type="text" className='auth__field' name='email' value={email} onChange={this.handleChange}/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field' name='pass' value={pass} onChange={this.handleChange}/>
               </div>
               <div className="auth__submit-line">
                  <p className="auth__link" onClick={this.changeMode}>Create an account</p>
                  <button type='submit' className="btn btn-primary auth__submit">Log in</button>
               </div>

             </form>
           </div>
           <div class="my-card__face my-card__face--back auth__elem">
             <p class="auth__title">Sign up</p>
             <form action="" class="auth__form" name='sign_up' onSubmit={this.handleSubmit}>
               <div class="auth__input">
                 <label className='auth__field-title'>email</label>
                 <input type="email" className='auth__field' name='email' value={email} onChange={this.handleChange}/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>login</label>
                 <input type="text" className='auth__field'/>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field' name='pass' value={pass} onChange={this.handleChange}/>
               </div>
               <div className="auth__submit-line">
               <p className="auth__link" onClick={this.changeMode}>Already have an account</p>
                  <button type='submit' className="btn btn-primary auth__submit">Sign in</button>
               </div>
             </form>
           </div>
         </div>
       </div>
      );
   }
}

export default AuthScreen;