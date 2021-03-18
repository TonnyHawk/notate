import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,
  Container, Row, Col } from 'reactstrap';

export default class Popup extends Component {

   state={
     name: '',
     editing: false,
     isOpen: false
   }
   

   static getDerivedStateFromProps(props, state){
    // let {id, files} = props.fileData
    //  if(files !== null && id !== null){
    //    if(!state.editing){
    //     let index = props.fileData.files.findIndex(elem=>{
    //       return elem.id === id
    //     })
    //     let name = files[index].name
    //     state.name = name
    //    }
    //   return state;
    //  }
    //  else return null

    if(props.popup.isOpen !== state.isOpen){
        if(props.popup.funct === 'rename a file'){
          let {id, files} = props.fileData
          let index = props.fileData.files.findIndex(elem=>{
            return elem.id === id
          })
          let name = files[index].name
          state.name = name
          state.isOpen = props.popup.isOpen
        }
        else if(props.popup.funct === 'rename a folder'){
          state.name = props.popup.data[0].name
          state.isOpen = props.popup.isOpen
        }
        else if(props.popup.funct === 'create a folder'){
          state.name = ''
          state.isOpen = props.popup.isOpen
        }

    }

    return state
   }

   handleInput=(e)=>{
    let txt = e.target.value
    let key = e.target.getAttribute('name')
    this.setState({
      [key]: txt,
      editing: true
    })
   }

   render() {
      let {popup} = this.props
      let toggle = ()=>{
        this.props.toggleElement('popup')
        this.setState({editing: false})
      }

      let {setLoading, renameFolder, renameFile, toggleElement} = this.props
      let info = {};
      switch(popup.funct){
        case 'create a folder':
          info = {
            title: 'Create a folder',
            placeHolder: 'Folder name',
            iconClass: 'fas fa-folder-open',
            function: ()=>{
              this.props.createFolder(this.state.name)
              this.props.toggleElement('popup')
            }
          }
          break;
        case 'rename a file':
          info = {
            title: 'Rename a file',
            placeHolder: 'File name',
            iconClass: 'far fa-file-alt',
            function: ()=>{
              setLoading(true, 'renaming...')
              renameFile(this.state.name)
              toggleElement('popup')
            }
          }
          break;
        case 'rename a folder':
          info = {
            title: 'Rename a folder',
            placeHolder: 'Folder name',
            iconClass: 'fas fa-folder-open',
            function: ()=>{
              setLoading(true, 'renaming...')
              renameFolder(this.state.name)
              toggleElement('popup')
              toggleElement('side-menu')
            }
          }
          break;
        default: info = {
          title: 'no title',
          placeHolder: '',
          iconClass: 'fas fa-exclamation-triangle'
        }
      }

      return (
         <div>
           <Modal isOpen={popup.isOpen} toggle={toggle}>
             <ModalHeader>{info.title}</ModalHeader>
             <ModalBody>
               <form onSubmit={(e)=>{e.preventDefault(); info.function()}}>
                  <Container fluid>
                    <Row>
                      <Col xs='auto' className='mx-auto'><div className="modal__icon"><i class={info.iconClass}></i></div></Col>
                      <div className="w-100 modal__break-line"></div>
                      <Col className='d-flex align-items-center'>
                        <Input 
                          type='text' name='name' 
                          onChange={this.handleInput} value={this.state.name} 
                          placeholder={info.placeHolder} autoComplete="off"
                          onFocus={e=>e.target.select()}></Input></Col>
                    </Row>
                  </Container>
               </form>
             </ModalBody>
             <ModalFooter>
               <Button color="secondary modal__btn" onClick={toggle}>Cancel</Button>{' '}
               <Button color="primary modal__btn" onClick={info.function}>Save</Button>
             </ModalFooter>
           </Modal>
         </div>
       );
   }
}
