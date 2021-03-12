import React, { Component } from 'react';
import $ from 'jquery';

export default class PopupWin extends Component {

   elem = React.createRef();
   field = React.createRef();

   componentDidUpdate(){
      let {isOn} = this.props
      isOn ? $(this.elem.current).fadeIn() : $(this.elem.current).fadeOut();
   }

   submitHandler=(e)=>{
      let {createFolder, toggleElement} = this.props
      let folderNameF = this.field.current;
      e.preventDefault();
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

   checkTheForm=()=>{
      if(this.field.current.value !== ''){
         return true
      } else return false
   }

   render() {
      let {toggleElement} = this.props
      return(
         <form class="popup modal" ref={this.elem} onSubmit={this.submitHandler}>
            <p class="popup__title">Create new folder</p>
            <div class="popup__close-btn" onClick={()=>toggleElement('popup')}><i class="fas fa-times"></i></div>
            <div class="popup__field-elem">
               <div class="popup__icon"><i class="far fa-folder"></i></div>
               <label className='popup__label'>Folder name:
                  <input type="text" ref={this.field} name='folder_name' class="popup__field" placeholder='Type folder name here...'/>
                  <p className='popup__field-message'>field shoul be fulfield</p>
               </label>
               <input type='submit' style={{display: 'none'}}/>
               <input type='hidden' name='option' value='create new folder'/>
            </div>
            <div class="popup__actions actions">
               <button class="popup__action-btn action-btn_red" onClick={(e)=>toggleElement('popup', e)}>dismiss</button>
               <button type='submit' class="popup__action-btn action-btn">save</button>
            </div>
         </form>
      );
   }
}