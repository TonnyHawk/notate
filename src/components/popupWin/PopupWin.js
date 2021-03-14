import React, { Component } from 'react';
import $ from 'jquery';

export default class PopupWin extends Component {

   constructor(props){
      super(props);
      this.state = {
         name: '',
         isFinished: true
      }
   }

   elem = React.createRef();
   field = React.createRef();

   componentDidUpdate(){
      let isOn = this.props.popup.isOpen
      isOn ? $(this.elem.current).fadeIn() : $(this.elem.current).fadeOut();
   }

   createFoldHandler=(e)=>{
      e.preventDefault();
      let {createFolder, toggleElement} = this.props
      let folderNameF = this.field.current;
      if(this.checkTheForm()){
         createFolder(folderNameF.value)
         toggleElement('popup');
         toggleElement('side-menu')
         folderNameF.value = '';
      } else{
         if(!$(folderNameF).next().hasClass('is-active')){
            $(folderNameF).next().addClass('is-active')
         }
      }

   }

   renameFileHandler=(e)=>{
      e.preventDefault();
      let {renameFile, toggleElement} = this.props
      renameFile(this.state.name)
      toggleElement('popup');
      this.setState({isFinished: true})
   }

   checkTheForm=()=>{
      if(this.field.current.value !== ''){
         return true
      } else return false
   }

   fillTheField=(e, fieldName)=>{
      this.setState({[fieldName]: e.target.value})
   }

   static getDerivedStateFromProps(props, state){
      if(state.isFinished){
         let {fileData} = props;
         let name = fileData.id ? fileData.files[fileData.files.findIndex(elem=>{return elem.id === fileData.id})].name : ''; // if there is selected file
         return {name, isFinished: false}
      } else return null
   }

   render() {
      let {toggleElement, popup, fileData} = this.props

      switch(popup.funct){
         case 'create a folder':
            return(
               <form class="popup modal" ref={this.elem} onSubmit={this.createFoldHandler}>
                  <p class="popup__title">Create a new folder</p>
                  <div class="popup__close-btn" onClick={()=>toggleElement('popup')}><i class="fas fa-times"></i></div>
                  <div class="popup__field-elem">
                     <div class="popup__icon"><i class="far fa-folder"></i></div>
                     <label className='popup__label'>Folder name:
                        <input type="text" ref={this.field} name='folder_name' class="popup__field" placeholder='Type folder name here...'/>
                        <p className='popup__field-message'>field should be fulfield</p>
                     </label>
                     <input type='submit' style={{display: 'none'}}/>
                  </div>
                  <div class="popup__actions actions">
                     <button class="popup__action-btn action-btn_red" onClick={(e)=>toggleElement('popup', e)}>dismiss</button>
                     <button type='submit' class="popup__action-btn action-btn">save</button>
                  </div>
               </form>
            );
         case 'rename a file':
            return(
               <form class="popup modal" ref={this.elem} onSubmit={this.renameFileHandler}>
                  <p class="popup__title">Rename a file</p>
                  <div class="popup__close-btn" onClick={()=>toggleElement('popup')}><i class="fas fa-times"></i></div>
                  <div class="popup__field-elem">
                     <div class="popup__icon"><i class="far fa-folder"></i></div>
                     <label className='popup__label'>File name:
                        <input 
                           type="text" name='folder_name' class="popup__field" placeholder='Type file name here...'
                           value={this.state.name}
                           // ref={this.field}
                           onChange={(e)=>this.fillTheField(e, 'name')}
                           />
                        <p className='popup__field-message'>field should be fulfield</p>
                     </label>
                     <input type='submit' style={{display: 'none'}}/>
                  </div>
                  <div class="popup__actions actions">
                     <button class="popup__action-btn action-btn_red" onClick={(e)=>toggleElement('popup', e)}>dismiss</button>
                     <button type='submit' class="popup__action-btn action-btn">save</button>
                  </div>
               </form>
            );
         default: 
            return(
               <form class="popup modal" ref={this.elem} onSubmit={this.submitHandler}>
                  <p class="popup__title">{popup.title}</p>
                  <div class="popup__close-btn" onClick={()=>toggleElement('popup')}><i class="fas fa-times"></i></div>
                  <div class="popup__field-elem">
                     <div class="popup__icon"><i class="far fa-folder"></i></div>
                     <label className='popup__label'>Folder name:
                        <input type="text" ref={this.field} name='folder_name' class="popup__field" placeholder='Type folder name here...'/>
                        <p className='popup__field-message'>field shoul be fulfield</p>
                     </label>
                     <input type='submit' style={{display: 'none'}}/>
                  </div>
                  <div class="popup__actions actions">
                     <button class="popup__action-btn action-btn_red" onClick={(e)=>toggleElement('popup', e)}>dismiss</button>
                     <button type='submit' class="popup__action-btn action-btn">save</button>
                  </div>
               </form>
            );
         }
   }
}