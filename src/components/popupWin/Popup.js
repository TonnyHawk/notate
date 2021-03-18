import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,
  Container, Row, Col } from 'reactstrap';

export default class Popup extends Component {

   state={
     name: '',
     editing: false
   }

  //  componentDidMount() {
  //    this.setState({name: this.props.})
  //  }
   

   static getDerivedStateFromProps(props, state){
    let {id, files} = props.fileData
     if(files !== null && id !== null){
       if(!state.editing){
        let index = props.fileData.files.findIndex(elem=>{
          return elem.id === id
        })
        let name = files[index].name
        state.name = name
       }
      return state;
     }
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
              this.props.renameFile(this.state.name)
              this.props.toggleElement('popup')
            }
          }
          break;
        case 'rename a folder':
          info = {
            title: 'Rename a folder',
            placeHolder: 'Folder name',
            iconClass: 'fas fa-folder-open',
            function: ()=>{
              this.props.renameFolder(this.state.name)
              this.props.toggleElement('popup')
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