import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,
  Container, Row, Col } from 'reactstrap';

export default class Popup extends Component {

   state={
     name: ''
   }

   handleInput=(e)=>{
    let txt = e.target.value
    let key = e.target.getAttribute('name')
    this.setState({
      [key]: txt
    })
   }

   render() {
      let {popup} = this.props
      let toggle = ()=>{
        this.props.toggleElement('popup')
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
                      <Col className='d-flex align-items-center'><Input type='text' name='name' onChange={this.handleInput} value={this.state.name} placeholder={info.placeHolder}></Input></Col>
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
