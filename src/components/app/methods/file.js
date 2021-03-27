export function select(e){
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

export function unsetCurrent(){
   this.setState({
      currentFile: {name: '', txt: '', folder: '', id: ''},
      selectedFileId: null
   })
}

export function setCurrent(id){
   let index = this.state.files.findIndex(elem=>{
      return elem.id === id
   })
   let currentFile = this.state.files[index]
   this.setState({currentFile}, ()=>this.setLoading(false))
}

export function open(id){
   this.setLoading(true, 'opening a file')
   this.openElement('editor')
   this.setCurrentFile(id)
}

export function create(name, txt, id=null){
   let {user, currentFolder} = this.state
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
      this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).collection('files').add({
         name, txt
      }).then(file=>{

         root.setCurrentFile(file.id)

      }).then(succes()).catch(err=>failure(err))
   } else{
      this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).collection('files').doc(id).set({
         name, txt
      }).then(succes()).catch(err=>failure(err))
   }
}

export function del(){
   let root = this;
   let {selectedFileId, currentFolder, user} = this.state;
   this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).collection('files').doc(selectedFileId).delete().then(()=>{
      root.setState({selectedFileId: null})
   })
}

export function rename(name){
   let root = this;
   let {selectedFileId, currentFolder, user} = this.state;
   this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).collection('files').doc(selectedFileId).update({
      name
   }).then(()=>{
      console.log('file renamed');
      root.setLoading(false)
   })
}

export function getFiles(){
   let root = this;
   let {currentFolder, user} = this.state
   if(this.fileListener !== null){
      this.fileListener() // unsubscribe from prev snapshots
   }

   let promise = new Promise((res, rej)=>{
      this.fileListener = this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).collection('files').onSnapshot(snap=>{
         if(snap.empty){ // if there is no files in folder
            if(root.state.files !== null){
               root.setState({files: null}, ()=>{
                  if(root.state.isLoading === true && root.state.loadingMessage === 'loading files'){
                     root.setLoading(false)
                     res()
                  }
               })
            } else{
               root.setLoading(false)
               res()
            }
            return promise
         }
   
         let files = [];
         snap.forEach(doc=>{
            files.push({name: doc.data().name, txt: doc.data().txt, folder: currentFolder.id, id: doc.id})
         })
   
         root.setState({files}, ()=>{
            if(root.state.isLoading === true && root.state.loadingMessage === 'loading files'){
               root.setLoading(false)
               res()
            }
         })
      }, error=>{
         console.log('error with getting a files'+error);
         rej(error)
      })
   })
   return promise
}