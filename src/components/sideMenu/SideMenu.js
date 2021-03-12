import React, { Component } from 'react';

class SideMenu extends Component {
   render() {

      let additionalClassNames = this.props.isOpen ? ' is-open' : '';


      let {currentFolder, choseFolder, toggleElement, delFolder, folders} = this.props;
      let menuItems = folders.map(folder=>{
        let addCl = folder.id === currentFolder.id ? 'is-active' : ''

        return (
          <div className={`side-menu__item menu-item ${addCl}`} key={folder.id}>
            <p class="menu-item__txt" onClick={()=>{choseFolder(folder.id)}}>{folder.name}</p>
            <div class="actions">
              <button class="actions__action action-btn"><i class="fas fa-pen"></i></button>
              <button class="actions__action action-btn" onClick={()=>delFolder(folder.id)}><i class="far fa-trash-alt"></i></button>
            </div>
          </div>
        )
      })

      return (
         <div class={`side-menu${additionalClassNames}`}>
         <div class="relative">
           <div class="side-menu__close action-btn_red" onClick={()=>toggleElement('side-menu')}><i class="fas fa-times"></i></div>
           <div className='side-menu__inner'>
           <div class="side-menu__title">
             <div class="side-menu__title-ic"><i class="fas fa-folder-open"></i></div>
             <div class="has-side-line side-menu__title-txt">
               <p>Folders</p>
               <div class="has-side-line__line"></div>
             </div>
             <div class="side-menu__title-actions">
               <button class="side-menu__action has-title action-btn" onClick={()=>toggleElement('popup')}>
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
      );
   }
}

export default SideMenu;