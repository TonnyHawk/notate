import React, { Component } from 'react';
import $ from 'jquery';
import Funcs from '../../services/funcs'

let funcs = new Funcs();

class FolderBody extends Component {

  foldBodyElem = React.createRef()

  _openFile = (e)=>{
    let elem = e.target.closest('.note')
    if(elem){ // if we clicked on .note
      let id = elem.getAttribute('data-id') 
      this.props.openFile(id)
    }
  }

  componentDidMount() {
    // setting events

    $(this.foldBodyElem.current).on('click', (e)=>{
      this.props.selectFile(e)
    })
    $(this.foldBodyElem.current).on('dblclick', e=>this._openFile(e))

    // END ---
  }
  
  

   render() {

    let {files, selectedFile, callPopup, search, delFile, selectFile, currentFolder} = this.props
    let message = null;
    if(files !== null){// if there is files in current folder
      files = funcs.filterArr(search, files)
      files = files.map(item=>{
        return (
          <div class="col-6 col-sm-4 col-md-3 col-xl-2" key={item.id}>
            <div 
              className={`note ${selectedFile===item.id ? 'is-active': ''}`} 
              data-id={item.id}
              >
              <div class="note__ic"><i class="fas fa-file-alt"></i></div>
              <div class="note__name">{funcs.elipsize(item.name, 29)}</div>
            </div>
          </div>
        )
      })
    } else{
      message = (
        <div className='folder-body__message'>
          <p>There is no files</p>
        </div>
      )
    }

      return (
        <>
      <div className="folder-nav container-lg mx-auto">
          <div className='folder-nav__breadcrumbs'>
            <p><i class="far fa-folder"></i> {currentFolder.name}</p>
          </div>
          <div className={`folder-nav__menu ${selectedFile !== null ? 'is-active' : ''}`}>
            <div className="menu-item mob" onClick={selectFile}><p>Done</p></div>
            <div className="menu-item"><i class="fas fa-edit" onClick={(e)=>callPopup('rename a file')}></i></div>
            <div className="menu-item"><i class="fas fa-trash" onClick={delFile}></i></div>
          </div>
        </div>
      <div class="folder-body" ref={this.foldBodyElem}>
        {message}
         <div class="container-lg">
           <div class="row">
              {files}
           </div>
         </div>
       </div>
       </>
      );
   }
}

export default FolderBody;