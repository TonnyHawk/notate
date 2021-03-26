import React, { Component } from 'react';
import Nav from '../nav/Nav';
import FolderBody from '../folderBody/FolderBody';
import SideMenu from '../sideMenu/SideMenu';
import File from '../file/File'
import Loader from '../loader/Loader'
import Popup from '../popupWin/Popup'
import AuthScreen from '../authScreen/AuthScreen'
import Preloader from '../preloader/Preloader'

import * as file from './methods/file'
import * as folder from './methods/folder'

import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyAmQehjEsx1sqD0QMqlgRsEHVA1530GiAs",
   authDomain: "notate-1f3b8.firebaseapp.com",
   databaseURL: "https://notate-1f3b8-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "notate-1f3b8",
   storageBucket: "notate-1f3b8.appspot.com",
   messagingSenderId: "1026983344770",
   appId: "1:1026983344770:web:6f2f6e9fddbbb9c56a529b"
 };

 if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig)
}else {
   firebase.app(); // if already initialized, use that one
}
 const fs = firebase.firestore()
 const usersRef = fs.collection('users')
 let fileListener = null;

class App extends Component {

   userListener = null
   foldersListener = null;
   _isMounted = false;
   constructor(props){
      super(props)

      this.usersRef = fs.collection('users')
      this.fileListener = null;
   }

   state = {
      showPreloader: false,
      preloaderState: 'hidden',
      documentState: 'ready',
      isSideMenuOpen: false,
      isFileEditorOn: false,
      isPopupOpen: false,
      popup: {isOpen: false, title: '', funct: 'create a folder', data: {}},
      isError: false,
      isLoading: false,
      loadingMessage: 'loading',
      currentFolder: '',
      currentFile: {name: '', txt: '', folder: '', id: ''},
      selectedFileId: null,
      files: null,
      folders: [],
      search: '',
      status: {state: '', message: '', id: 0},
      user: null,
   }

   componentDidMount() {
      this._isMounted = true;
      if(window.navigator.onLine){
         this.listenToAuth()
         this.signIn('anton.veremko@gmail.com', 'antony2509')
         // .then((res)=>{
         //    this.getFolders().then(()=>this.choseFolder());
         // }).catch(err=>console.log(err))

         // this.getFolders().then(()=>this.choseFolder());
      } else{
         this.handleError('no network')
      }
   }

   componentDidCatch(error, info) {
      this.handleError()
      console.log("error: "+error);
   }

   componentWillUnmount() {
      this._isMounted = false;
      this.userListener && this.userListener();
      this.listenToAuth = undefined;
   }

   setPreloader=(opt)=>{
      let promise = new Promise((res, rej)=>{
         this.setState({showPreloader: opt}, ()=>{
            res()
         })
      })
      return promise
   }
   

   setUser=(...data)=>{
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

   listenToAuth=()=>{
      let root = this;
      this.userListener = firebase.auth().onAuthStateChanged((user)=>{
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

   registerUser=(email, pass)=>{
      let root = this;
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        // Signed in 
        let user = userCredential.user;
        console.log(userCredential);
        // ...
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
   }

   signIn=(email, pass)=>{
      let root = this;
      let promise =  new Promise((resolve, reject)=>{
         firebase.auth().signInWithEmailAndPassword(email, pass)
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

   signOut=()=>{
      let root = this;
      firebase.auth().signOut().then(function() {
         // Sign-out successful.
         root.toggleElement('side-menu')
         // root.toggleElement('preloader')
       }, function(error) {
         // An error happened.
       });
   }

   setStatus=(stat, txt)=>{
      this.setState(({status})=>{return {status: {state: stat, message: txt, id: status.id++}}})
   }

   callPopup=(funct, ...data)=>{
      let popup = {
         funct, isOpen: true, data
      }
      for(let key in this.state.popup){
         if(!popup[key]){ // if such element is absent in new popup setting
            popup[key] = this.state.popup[key] // then we will use the prev value from state
         }
      }
      this.setState({popup})
   }

   // File functions ----------------

   selectFile = file.select.bind(this)

   unsetCurrentFile = file.unsetCurrent.bind(this)

   setCurrentFile = file.setCurrent.bind(this)

   openFile = file.open.bind(this)

   createFile = file.create.bind(this)

   delFile = file.del.bind(this)

   renameFile = file.rename.bind(this)

   getFiles = file.getFiles.bind(this)

   // Folder functions ------------------

   renameFolder = folder.rename.bind(this)

   setCurrentFolder = folder.setCurrent.bind(this)

   getFolders = folder.getFolders.bind(this)

   createFolder = folder.create.bind(this)

   delFolder = folder.del.bind(this)

   choseFolder = folder.chose.bind(this)



   handleError=(message='some error ocured')=>{
      this.setState(({isError})=>{return {isError: !isError}})
      console.log(message);
   }

   setLoading=(option, message='')=>{
      this.setState({isLoading: option, loadingMessage: message})
   }

   toggleElement=(elem, event=null)=>{
      switch(elem){
         case 'side-menu':
            this.setState(({isSideMenuOpen})=>{
               return {isSideMenuOpen: !isSideMenuOpen}
            })
            break;
         case 'editor':
            this.setState(({isFileEditorOn})=>{
               return {isFileEditorOn: !isFileEditorOn}
            })
            break;
         case 'popup':
            if(event){
               event.preventDefault()
            }
            this.setState(({popup})=>{
               let newPopup = {...popup};
               newPopup.isOpen = !newPopup.isOpen
               return {popup: newPopup}
            })
            break;
         case 'preloader':
            this.setState(({showPreloader})=>{
               return {showPreloader: !showPreloader}
            }, ()=>console.log("preloader: "+this.state.showPreloader))
            break;
         default: return null;
      }
   }

   openElement=(elem)=>{
      switch(elem){
         case 'editor':
            if(!this.state.isFileEditorOn){
               this.toggleElement('editor')
            }
            break;
         default: return null;
      }
   }

   handleInput=(e)=>{
      let key = e.target.getAttribute('name')
      let value = e.target.value
      this.setState({[key]: value})
   }

   render() {
      let {isSideMenuOpen, currentFolder, files, 
            search, currentFile, status , showPreloader, user, 
            preloaderState, documentState} = this.state

      return (
         <>
                  <Nav 
                     toggleElement={this.toggleElement}
                     doSearch={this.handleInput}
                     handleInput={this.handleInput}
                     searchState={search}
                  />
                  <FolderBody 
                     files={files}
                     search={search}
                     currentFolder={currentFolder}
                     openFile={this.openFile}
                     selectedFile={this.state.selectedFileId}
                     selectFile={this.selectFile}
                     delFile={this.delFile}
                     callPopup={this.callPopup}/>
                  <SideMenu 
                     isOpen={isSideMenuOpen}
                     toggleElement={this.toggleElement}
                     createFolder={this.createFolder}
                     folders={this.state.folders}
                     delFolder={this.delFolder}
                     currentFolder={this.state.currentFolder}
                     choseFolder={this.choseFolder}
                     callPopup={this.callPopup}
                     user={user}
                     signOut={this.signOut}
                     />
                  <Popup 
                     popup={this.state.popup}
                     toggleElement={this.toggleElement}
                     renameFile={this.renameFile}
                     renameFolder={this.renameFolder}
                     createFolder={this.createFolder}
                     fileData={{id: this.state.selectedFileId, files: this.state.files}}
                     folderData={{folders: this.state.folders}}
                     setLoading={this.setLoading}/>
                  <File 
                     state={this.state.isFileEditorOn}
                     createFile={this.createFile}
                     currentFile={currentFile}
                     status={status}
                     setStatus={this.setStatus}/>
            <div 
               className={`add-btn${this.state.isFileEditorOn ? ' active' : ''}`} 
               onClick={()=>{this.unsetCurrentFile(); this.toggleElement('editor')}}><i class="fas fa-plus"></i>
               </div>
            <Loader 
               state={this.state.isLoading} 
               message={this.state.loadingMessage}/>

            <AuthScreen 
               toggleElement={this.toggleElement}
               registerUser={this.registerUser}
               signIn={this.signIn}
               user={user}
               />
            {/* <Preloader 
               show={showPreloader}
               toggleElement={this.toggleElement}
               preloaderState={preloaderState}
               documentState={documentState}
               /> */}
         </>
      );
   }
}

export default App;