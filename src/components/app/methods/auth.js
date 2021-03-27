export function setUser(...data){
   let user = {
      name: data[0],
      id: data[1]
   };
   if(data.length <= 0){
      user = null
   }
   let promise = new Promise((resolve, reject)=>{
      this.setState({user}, ()=>{
         resolve(this.state.user);
      })
   })
   return promise
}

export function listen(){
   let root = this;
   this.userListener = this.firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
      //   console.log(`SIGNED IN ${user} ${user.email} ${user.uid}`);
      this.openPreloader().then(()=>{
         // console.log('preloader is opened');
         root.setUser(user.email, user.uid).then(()=>{
            // console.log('setted user');
            root.getFolders().then((message)=>{
               // console.log(message);
               this.choseFolder().then(()=>{
                  // console.log('chosed folder');
                  // console.log('document is ready');
                  this.setDocumentReadyState(true)
               }).catch(er=>console.log(`can not chose a folder ${er}`))
            }).catch(er=>console.log(er));
         })
      }).catch(()=>alert('preloader error'))
      } else {
        // No user is signed in.
        if(!this.state.isNewlyCreated){ // user was never been authorized
         this.openPreloader().then(()=>{
            root.setUser().then(()=>{
               // console.log('document is ready');
               this.setDocumentReadyState(true)
            })
           })
         }else{
            this.setState({isNewlyCreated: false})
         }
      }
    });
}

export function registerUser(email, pass){
   let promise = new Promise((res, rej)=>{
      this.firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in 
        res()
        // ...
      })
      .catch((error) => {
        rej(error.message)
        // ..
      });
   })
   return promise
}

export function signIn(email, pass){
   let promise =  new Promise((resolve, reject)=>{
      this.firebase.auth().signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in

      resolve()
        
        // ...
      })
      .catch((error) => {
        reject('can not authorize - '+error.message)
      });
   })
   return promise
}

export function signOut(){
   let root = this;
   this.firebase.auth().signOut().then(function() {
      // Sign-out successful.
      root.toggleElement('side-menu')
    }, function(error) {
      // An error happened.
    });
}