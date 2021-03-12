import React, { Component } from 'react';

class FolderBody extends Component {
   render() {

    let {files} = this.props
    let message = null;
    if(files !== null){// if there is files in current folder
      files = files.map(item=>{
        return (
          <div class="col-6 col-sm-4 col-md-3 col-lg-2" key={item.id}>
            <div class="note">
              <div class="note__ic"><i class="fas fa-file-alt"></i></div>
              <div class="note__name">{item.name}</div>
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
      <div class="folder-body">
        <div className='folder-body__breadcrumbs'>
          <p>current folder: {this.props.currentFolder.name}</p>
        </div>
        {message}
         <div class="container-lg">
           <div class="row">
              {files}
           </div>
         </div>
       </div>
      );
   }
}

export default FolderBody;