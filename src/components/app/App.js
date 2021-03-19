import React, { Component } from 'react';
import Nav from '../nav/Nav';
import FolderBody from '../folderBody/FolderBody';
import SideMenu from '../sideMenu/SideMenu';
import File from '../file/File'
import Loader from '../loader/Loader'
import Popup from '../popupWin/Popup'

import firebase from "firebase/app";
import "firebase/firestore"

import '../../styles/main.scss';


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
 const foldRef = fs.collection('folders')
 let fileListener = null;

class App extends Component {

   state = {
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
      status: {state: '', message: '', id: 0}
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
      let {currentFolder, folders} = this.state
      if(currentFolder === ''){
         this.choseFolder(folders[0].id)
      }
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

   selectFile=(e)=>{
      let elem = e.target.closest('.note')
      if(elem !== null){
         let id = elem.getAttribute('data-id')
         this.setState({selectedFileId: id})
      } else{
         if(this.state.selectedFileId !== null){
            this.setState({selectedFileId: null})
         }
      }
   }

   unsetCurrentFile=()=>{
      this.setState({
         currentFile: {name: '', txt: '', folder: '', id: ''},
         selectedFileId: null
      })
   }

   setCurrentFile=(id)=>{
      let index = this.state.files.findIndex(elem=>{
         return elem.id === id
      })
      let currentFile = this.state.files[index]
      this.setState({currentFile}, ()=>this.setLoading(false))
   }

   openFile=(id)=>{
      console.log('open file');
      this.setLoading(true, 'opening a file')
      this.openElement('editor')
      this.setCurrentFile(id)
   }

   createFile=(name, txt, id=null)=>{
      let root = this
      function succes(){
         if(id===null){
            root.setStatus(true, 'created a new file')
         } else root.setStatus(true, 'changes saved to file')
      }
      function failure(){
         root.setStatus(false, 'can not save the file')
      }

      if(id === null){
         foldRef.doc(this.state.currentFolder.id).collection('files').add({
            name, txt
         }).then(file=>{

            root.setCurrentFile(file.id)

         }).then(succes()).catch(err=>failure(err))
      } else{
         foldRef.doc(this.state.currentFolder.id).collection('files').doc(id).set({
            name, txt
         }).then(succes()).catch(err=>failure(err))
      }
   }

   delFile=()=>{
      let root = this;
      let {selectedFileId, currentFolder} = this.state;
      foldRef.doc(currentFolder.id).collection('files').doc(selectedFileId).delete().then(()=>{
         root.setState({selectedFileId: null})
      })
   }

   renameFile=(name)=>{
      let root = this;
      let {selectedFileId, currentFolder} = this.state;
      foldRef.doc(currentFolder.id).collection('files').doc(selectedFileId).set({
         name
      }).then(()=>{
         console.log('renamed');
         root.setLoading(false)
      })
   }

   renameFolder=(name)=>{
      let {currentFolder} = this.state;
      let root = this;
      foldRef.doc(currentFolder.id).set({
         name
      }).then(()=>{
         foldRef.doc(currentFolder.id).get().then(doc=>{
            root.setCurrentFolder(doc.data().name, doc.id)
         })
      }).then(()=>{
         console.log('renamed');
         root.setLoading(false)
      })
   }

   setCurrentFolder=(name, id)=>{
      this.setState({currentFolder: {name, id}})
   }

   getFiles=()=>{
      let root = this;
      let {currentFolder} = this.state
      if(fileListener !== null){
         fileListener() // unsubscribe from prev snapshots
      }
      fileListener = foldRef.doc(currentFolder.id).collection('files').onSnapshot(snap=>{
         if(snap.empty){ // if there is no files in folder
            if(root.state.files !== null){
               root.setState({files: null}, ()=>{
                  if(root.state.isLoading === true && root.state.loadingMessage === 'loading files'){
                     root.setLoading(false)
                  }
               })
            } else{
               root.setLoading(false)
            }
            return
         }

         let files = [];
         snap.forEach(doc=>{
            files.push({name: doc.data().name, txt: doc.data().txt, folder: currentFolder.id, id: doc.id})
         })


         root.setState({files}, ()=>{
            if(root.state.isLoading === true && root.state.loadingMessage === 'loading files'){
               root.setLoading(false)
            }
         })
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
         let folders = [];
         snap.forEach(elem=>{
            folders.push({name: elem.data().name, id: elem.id, data: elem.data()})
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


   choseFolder=(id)=>{
      let {folders} = this.state;
      let index = folders.findIndex(elem=>elem.id === id)
      this.setState({
         currentFolder: {name: folders[index].name, id: folders[index].id},
      }, ()=>{
         this.setLoading(true, 'loading files')
         this.getFiles()
         if(this.state.isSideMenuOpen){
            this.toggleElement('side-menu')
         }
      })
   }



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
      let {isSideMenuOpen, currentFolder, files, search, currentFile, status} = this.state

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
                     status={status}/>
            <div 
               className={`add-btn${this.state.isFileEditorOn ? ' active' : ''}`} 
               onClick={()=>{this.unsetCurrentFile(); this.toggleElement('editor')}}><i class="fas fa-plus"></i>
               </div>
            <Loader 
               state={this.state.isLoading} 
               message={this.state.loadingMessage}/>
         </>
      );
   }
}

export default App;