import React, { Component } from 'react';

class AuthScreen extends Component {

  rootElem = React.createRef()

   state = {
      loginMode: true,
      email: '',
      pass: '',
      waitingForResponce: false,
      error: {state: false, txt: ''}
   }

   changeMode=()=>{
      this.setState(({loginMode})=>{
        this.setError()
         return {loginMode: !loginMode}
      })
   }

   setError=(state, txt)=>{
     if(!state && !txt){
       state = false
       txt = ''
     }
     this.setState({error: {state, txt}})
   }

   handleFocus=()=>{
   }

   handleSubmit=(e)=>{
      e.preventDefault();
      let formName = e.target.name
      // this.props.toggleElement('preloader')
      this.setState({waitingForResponce: true})

      let fields = e.target.querySelectorAll('.input__field')
      fields.forEach(elem=>{
        if(!elem.value){
          elem.closest('.input').querySelector('.input__error').classList.add('is-active')
        } else{
          elem.closest('.input').querySelector('.input__error').classList.remove('is-active')
        }
      })

      let {email, pass} = this.state;
      let {registerUser, signIn} = this.props

      if(formName === 'sign_in'){
        signIn(email, pass).then(()=>{
          this.setState({waitingForResponce: false})
        }).catch((error)=>{
          this.setState({waitingForResponce: false, error: {state: true, txt: error}})
        })
      }
      else if(formName === 'sign_up'){
        registerUser(email, pass).then(()=>{
          this.setState({waitingForResponce: false})
        }).catch((error)=>{
          this.setState({waitingForResponce: false, error: {state: true, txt: error}})
        })
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
     let {email, pass, error} = this.state;
      return (
         <div class={`auth ${!this.props.user ? 'is-active' : ''}`} ref={this.rootElem}>
         <div class={`my-card ${this.state.loginMode ? '' : 'do-flip'}`}>
           <div class="my-card__face my-card__face--front auth__elem">
             <p class="auth__title">Sign in</p>
             <form action="" name='sign_in' class="auth__form" onSubmit={this.handleSubmit}>
               <div class="auth__input input">
                 <label className='auth__field-title'>email</label>
                 <input type="text" className='auth__field input__field' name='email' 
                        value={email} onChange={this.handleChange} onFocus={this.handleFocus}
                        />
                  <p className="input__error">this field is not correct fulfield</p>
               </div>
               <div class="auth__input input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field input__field' name='pass' 
                        value={pass} onChange={this.handleChange} onFocus={this.handleFocus}
                        />
                  <p className="input__error">this field is not correct fulfield</p>
               </div>
               <div className={`auth__error bg-danger ${error.state ? 'is-visible' : ''}`}>
                 <p>{error.txt}</p>
               </div>
               <div className="auth__submit-line">
                  <p className="auth__link" onClick={this.changeMode}>Create an account</p>
                  <button type='submit' className="btn btn-primary auth__submit">
                    {!this.state.waitingForResponce ? 'Log in' : (
                      <div class="m-1 spinner-border spinner-border-sm" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    )}
                  </button>
               </div>

             </form>
           </div>
           <div class="my-card__face my-card__face--back auth__elem">
             <p class="auth__title">Sign up</p>
             <form action="" class="auth__form" name='sign_up' onSubmit={this.handleSubmit}>
             <div class="auth__input input">
                 <label className='auth__field-title'>email</label>
                 <input type="text" className='auth__field input__field' name='email' 
                        value={email} onChange={this.handleChange} onFocus={this.handleFocus}
                        />
                  <p className="input__error">this field is not correct fulfield</p>
               </div>
               <div class="auth__input">
                 <label className='auth__field-title'>login</label>
                 <input type="text" className='auth__field'/>
               </div>
               <div class="auth__input input">
                 <label className='auth__field-title'>password</label>
                 <input type="password" className='auth__field input__field' name='pass' 
                        value={pass} onChange={this.handleChange} onFocus={this.handleFocus}
                        />
                  <p className="input__error">this field is not correct fulfield</p>
               </div>
               <div className={`auth__error bg-danger ${error.state ? 'is-visible' : ''}`}>
                 <p>{error.txt}</p>
               </div>
               <div className="auth__submit-line">
               <p className="auth__link" onClick={this.changeMode}>Already have an account</p>
               <button type='submit' className="btn btn-success auth__submit">
                    {!this.state.waitingForResponce ? 'Sign up' : (
                      <div class="m-1 spinner-border spinner-border-sm" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    )}
                  </button>
               </div>
             </form>
           </div>
         </div>
       </div>
      );
   }
}

export default AuthScreen;