export function rename(name){
   let {currentFolder, user} = this.state;
   let root = this;
   this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).update({
      name
   }).then(()=>{
      this.usersRef.doc(user.id).collection('folders').doc(currentFolder.id).get().then(doc=>{
         root.setCurrentFolder(doc.data().name, doc.id)
      })
   }).then(()=>{
      console.log('folder renamed');
      root.setLoading(false)
   })
}

export function setCurrent(name, id){
   this.setState({currentFolder: {name, id}})
}

export function getFolders(){
   let root = this;
   let {user} = this.state
   let promise = new Promise((resolve, reject)=>{
      this.usersRef.doc(user.id).collection('folders').onSnapshot(snap => {
         if(snap.empty){// if collection 'folders' is absent on the firebase
            this.createFolder('exapmle folder').then((res)=>{
               resolve("in getFolders: "+res)
            }).catch((er)=>console.log(er))
            return promise
         }
         let folders = [];
         snap.forEach(elem=>{
            folders.push({name: elem.data().name, id: elem.id, data: elem.data()})
         })
         root.setState({folders}, ()=>resolve('getted all folders'))
      }, error=>{
         reject('can not get folders')
      })
   })

   return promise
}

export function create(name){
   return new Promise((res, rej)=>{
      let root = this;
      this.setLoading(true, 'creating a new folder')
      let {user} = this.state
   
      this.usersRef.doc(user.id).collection('folders').add({
         name: name
      }).then((elem)=>{
   
         elem.get().then(doc=>{
            root.choseFolder(doc.id) // created folder is now Current
            root.setLoading(false)
            res('created a new folder')
         })
   
      }).catch((er)=>{console.log('error with creating a folder '+er); rej(er)})
   })
}

export function del(id){
   let {folders, user} = this.state;
   if(folders.length > 1){// to prevent deleting the last folder

      this.usersRef.doc(user.id).collection('folders').get().then(folds=>{
         folds.forEach(folder=>{
            if(folder.id === id){
               this.usersRef.doc(user.id).collection('folders').doc(folder.id).collection('files').get().then(files=>{ //deleting all files
                  files.forEach(file=>{
                     this.usersRef.doc(user.id).collection('folders').doc(folder.id).collection('files').doc(file.id).delete().then(()=>{
                     })
                  })
               }).then(()=>{
                  this.usersRef.doc(user.id).collection('folders').doc(folder.id).delete().then(()=>{ // deleting folder
                     this.choseFolder()
                  })
               })
            }
         })
      })

   } else{
      alert('You can not delete the last folder, at least one should be present')
   }

}

export function chose(id){
   return new Promise((res, rej)=>{
      let {folders} = this.state;
      let index = 0;
      if(id){
         index = folders.findIndex(elem=>elem.id === id)
      }
      this.setState({
         currentFolder: {name: folders[index].name, id: folders[index].id},
      }, ()=>{
         this.setLoading(true, 'loading files')
         this.getFiles()
            .then(()=>{
               // console.log('files getted');
               res('files getted successfuly')})
            .catch(()=>{
               console.log('files not getted');
               rej('some err on getting a files')})
         if(this.state.isSideMenuOpen){
            this.toggleElement('side-menu')
         }
      })
   })
}