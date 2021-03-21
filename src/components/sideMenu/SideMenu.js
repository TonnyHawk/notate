import React, { Component } from 'react';
import $ from 'jquery';
import Funcs from '../../services/funcs'

let funcs = new Funcs();

class SideMenu extends Component {

  blackScreen = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    this.props.isOpen ? $(this.blackScreen.current).fadeIn() : $(this.blackScreen.current).fadeOut();
  }
  

   render() {

    let {currentFolder, choseFolder, toggleElement, delFolder, folders, callPopup, isOpen, user} = this.props;

      let additionalClassNames = isOpen ? ' is-open' : '';

      let menuItems = folders.map(folder=>{
        let addCl = folder.id === currentFolder.id ? 'is-active' : ''

        return (
          <div className={`side-menu__item menu-item ${addCl}`} key={folder.id}>
            <p class="menu-item__txt" onClick={()=>{choseFolder(folder.id)}}>{folder.name}</p>
            <div class="actions">
              <button class="actions__action action-btn btn btn-warning" onClick={()=>{callPopup('rename a folder', {name: folder.name}); }}><i class="fas fa-pen"></i></button>
              <button class="actions__action action-btn btn btn-danger" onClick={()=>delFolder(folder.id)}><i class="far fa-trash-alt"></i></button>
            </div>
          </div>
        )
      })

      return (
        <>
          <div class='black-screen' ref={this.blackScreen} onClick={()=>toggleElement('side-menu')}></div>
         <div class={`side-menu${additionalClassNames}`}>
         <div class="relative">
           <div class="side-menu__close action-btn_red" onClick={()=>toggleElement('side-menu')}><i class="fas fa-times"></i></div>
           <div className='side-menu__inner'>

  <div class="side-menu__user user">
    <div className="user__aside">
      <div class="user__pict">
      
      </div>
    </div>
    <div class="user__body">
      <p class="user__name">{user ? funcs.elipsize(user.name, 15) : 'not signed id'}</p>
      <div class="user__actions">
        <button class="user__action btn btn-danger btn-sm" onClick={this.props.signOut}>Log out</button>
      </div>
    </div>
  </div>



           <div class="side-menu__title">
             <div class="side-menu__title-ic"><i class="fas fa-folder-open"></i></div>
             <div class="has-side-line side-menu__title-txt">
               <p>Folders</p>
             </div>
             <div class="side-menu__title-actions">
               <button class="side-menu__action has-title action-btn btn btn-primary" onClick={()=>{callPopup('create a folder'); }}>
                 <i class="fas fa-plus"></i>
                 <div class="has-title__title">
                   <p class="has-title__title-txt">add new folder</p>
                 </div>
               </button>
             </div>
           </div>
          {menuItems}
          </div>
         </div>
       </div>
      </>
      );
   }
}

export default SideMenu;