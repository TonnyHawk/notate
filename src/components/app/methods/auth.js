export function setUser(...data){
   this.setPreloader(true)
   let user = {
      name: data[0],
      id: data[1]
   };
   if(data.length <= 0){
      user = null
   }
   let promise = new Promise((resolve, reject)=>{
      this.setPreloader(false)
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
         root.setUser(user.email, user.uid).then(()=>{
         root.getFolders().then(()=>{
            this.choseFolder()
         });
        })
      } else {
        // No user is signed in.
        root.setUser()
      }
    });
}

export function registerUser(email, pass){
   let root = this;
   let promise = new Promise((res, rej)=>{
      this.firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in 
        let user = userCredential.user;
        console.log(userCredential);
        res()
        // ...
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorMessage);
        rej(error)
        // ..
      });
   })
   return promise
}

export function signIn(email, pass){
   let root = this;
   let promise =  new Promise((resolve, reject)=>{
      this.firebase.auth().signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        this.setUser(user.email, user.uid).then(res=>{
           resolve(res)
         })
        
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        reject('can not authorize - '+errorMessage)
      });
   })
   return promise
}

export function signOut(){
   let root = this;
   this.firebase.auth().signOut().then(function() {
      // Sign-out successful.
      root.toggleElement('side-menu')
      // root.toggleElement('preloader')
    }, function(error) {
      // An error happened.
    });
}