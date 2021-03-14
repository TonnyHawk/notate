import React, { Component } from 'react';
import $ from 'jquery';

let filterArr=(str, arr)=>{
  if(str.length === 0){
     return arr
  }

  return arr.filter(file=>{
     return file.name.match(str)
  })
}

let mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


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
    if(!mobileAndTabletCheck()){ // if we are using desctop 
      $(this.foldBodyElem.current).on('click', (e)=>{
        this.props.selectFile(e)
      })
      $(this.foldBodyElem.current).on('dblclick', e=>this._openFile(e))
    } else{ // on mobile devices
      let countDown;
      $(this.foldBodyElem.current).on('click', (e)=>{this._openFile(e); console.log('clicked');})
      $(this.foldBodyElem.current).on('touchstart', e=>{
        e.preventDefault();
        countDown = setTimeout(()=>this.props.selectFile(e), 600);
      })
      $(this.foldBodyElem.current).on('touchend ', e=>{
        e.preventDefault();
        clearTimeout(countDown);
        if(this.props.selectedFile === null){
          this._openFile(e)
        }
      })
    }
    // END ---
  }
  
  

   render() {

    let {files, selectedFile, callPopup, search, delFile, selectFile, currentFolder} = this.props
    let message = null;
    if(files !== null){// if there is files in current folder
      files = filterArr(search, files)
      files = files.map(item=>{
        return (
          <div class="col-6 col-sm-4 col-md-3 col-xl-2" key={item.id}>
            <div 
              className={`note ${selectedFile===item.id ? 'is-active': ''}`} 
              data-id={item.id}
              >
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
        <>
      <div className="folder-nav container-lg mx-auto">
          <div className='folder-nav__breadcrumbs'>
            <p>Folder: {currentFolder.name}</p>
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