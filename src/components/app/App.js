import React, { Component } from 'react';
import Nav from '../nav/Nav';
import FolderBody from '../folderBody/FolderBody';
import SideMenu from '../sideMenu/SideMenu';
import BlackScreen from '../blackScreen/BlackScreen'
import File from '../file/File'
import PopupWin from '../popupWin/PopupWin'
import Loader from '../loader/Loader'

import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
   apiKey: "AIzaSyAmQehjEsx1sqD0QMqlgRsEHVA1530GiAs",
   authDomain: "notate-1f3b8.firebaseapp.com",
   databaseURL: "https://notate-1f3b8-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "notate-1f3b8",
   storageBucket: "notate-1f3b8.appspot.com",
   messagingSenderId: "1026983344770",
   appId: "1:1026983344770:web:6f2f6e9fddbbb9c56a529b"
 };

 firebase.initializeApp(firebaseConfig)
 const fs = firebase.firestore()
 const foldRef = fs.collection('folders')
 let fileListener = null;

class App extends Component {

   blackScreenElem = null
   popupElem = null

   state = {
      isSideMenuOpen: false,
      isFileEditorOn: false,
      isPopupOpen: false,
      isError: false,
      isLoading: false,
      loadingMessage: 'loading',
      currentFolder: '',
      files: null,
      folders: []
   }

   componentDidMount() {
      if(window.navigator.onLine){
         this.getFolders()
      } else{
         this.handleError('no network')
      }
   }

   componentDidCatch(error, info) {
      this.handleError()
      console.log("error: "+error);
   }

   componentDidUpdate(){
      let {currentFolder, folders, files} = this.state
      if(currentFolder === ''){
         this.choseFolder(folders[0].id)
      }
   }

   getFiles=()=>{
      console.log('getting files');
      let root = this;
      let {currentFolder} = this.state
      // if(fileListener !== null){
      //    fileListener() // unsubscribe from prev snapshots
      // }
      fileListener = foldRef.doc(currentFolder.id).collection('files').onSnapshot(snap=>{
         console.log(`name: ${currentFolder.name}, id: ${currentFolder.id}`);
         if(snap.empty){
            console.log('snap files is empty');
            if(root.state.files !== null){
               root.setState({files: null})
            }
            return
         }

         let files = [];
         snap.forEach(doc=>{
            files.push({name: doc.data().name, txt: doc.data().txt, folder: currentFolder.id, id: doc.id})
         })
         root.setState({files})
      }, error=>{
         console.log('error with getting a files'+error);
      })
   }
   

   getFolders=()=>{
      let root = this;

      foldRef.onSnapshot(snap => {
         if(snap.empty){// if collection 'folders' is absent on the firebase
            this.createFolder('exapmle folder')
            return
         }
         console.log('folders snap occured');
         let folders = [];
         snap.forEach(elem=>{
            folders.push({name: elem.data().name, id: elem.id, data: elem.data()})
            // console.log(elem.collection());
         })
         root.setState({folders})
      }, error=>{
         console.log('error');
      })
   }

   createFolder=(name)=>{
      let root = this;
      this.setLoading(true, 'creating a new folder')
      foldRef.add({
         name: name
      }).then((elem)=>{

         elem.get().then(doc=>{
            root.choseFolder(doc.id) // created folder is now Current
            root.setLoading(false)
         })

      }).catch((er)=>{console.log('error with creating a folder '+er)})
   }

   delFolder=(id)=>{
      let root = this;
      let {currentFolder, folders} = this.state
      if(folders.length > 1){// to prevent deleting the last folder
         foldRef.doc(id).delete().then(()=>{
            if(currentFolder.id === id){
               root.setState({currentFolder: ''})
            }
         })
      } else{
         alert('You can not delete the last folder, at least one should be present')
      }

   }


   createFile=(name, txt)=>{
      foldRef.doc(this.state.currentFolder.id).collection('files').add({
         name, txt
      }).then(()=>{
         console.log('succeed');
      }).catch(err=>{
         console.log('can not create file '+err);
      })
   }


   choseFolder=(id)=>{
      let {folders} = this.state;
      let index = folders.findIndex(elem=>elem.id === id)
      this.setState({currentFolder: {name: folders[index].name, id: folders[index].id}})
      this.getFiles()
   }



   handleError=(message='some error ocured')=>{
      let root = this;
      this.setState(({isError})=>{return {isError: !isError}})
      console.log(message);
   }

   setLoading=(option, message)=>{
      if(option){
         this.setState({isLoading: true, loadingMessage: message})
      } else{
         this.setState({isLoading: false, loadingMessage: ''})
      }
   }

   toggleClass=(elem, classN)=>{
      if(elem === 'black-screen'){
         this.blackScreenElem.current.classList.toggle(classN);
      } else{
         elem.current.classList.toggle(classN);
      }
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
            this.setState(({isPopupOpen})=>{
               return {isPopupOpen: !isPopupOpen}
            })
      }
   }

   // setElem=(elem, option)=>{
   //    switch(option){
   //       case 'black-screen':
   //          this.blackScreenElem = elem
   //          break;
   //       case 'popup':
   //          this.popupElem = elem
   //          break;
   //       default: return null
   //    }
   //    console.log(elem);
   // }

   render() {
      let {isSideMenuOpen, currentFolder} = this.state

      return (
         <>
            <Nav 
               toggleElement={this.toggleElement}
               toggleClass={this.toggleClass}
               blackScreen={this.blackScreenElem}
            />
            <FolderBody files={this.state.files} currentFolder={currentFolder}/>
            <SideMenu 
               isOpen={isSideMenuOpen}
               toggleElement={this.toggleElement}
               createFolder={this.createFolder}
               folders={this.state.folders}
               delFolder={this.delFolder}
               currentFolder={this.state.currentFolder}
               choseFolder={this.choseFolder}
               />
            <BlackScreen elements={{isSideMenuOpen}}/>
            <File 
               state={this.state.isFileEditorOn}
               createFile={this.createFile}/>
            <PopupWin 
               isOn={this.state.isPopupOpen} 
               toggleElement={this.toggleElement}
               createFolder={this.createFolder}/>
            <Loader 
               state={this.state.isLoading} 
               message={this.state.loadingMessage}/>
            <div className={`add-btn${this.state.isFileEditorOn ? ' active' : ''}`} onClick={()=>this.toggleElement('editor')}><i class="fas fa-plus"></i></div>
         </>
      );
   }
}

export default App;