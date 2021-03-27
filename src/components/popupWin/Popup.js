import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,
  Container, Row, Col } from 'reactstrap';

export default class Popup extends Component {

  info = {}

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

   handleSubmit=(e, funct)=>{
    e.preventDefault();

    let fields = e.target.querySelectorAll('.input__field')

    let acces = true;
    fields.forEach(elem=>{
      if(!elem.value){
        elem.closest('.input').querySelector('.input__error').classList.add('is-active')
        acces = false
      } else{
        elem.closest('.input').querySelector('.input__error').classList.remove('is-active')
      }
    })

    if(acces){
      funct()
    }

   }

   render() {
      let {popup} = this.props
      let toggle = ()=>{
        this.props.toggleElement('popup')
        this.setState({editing: false})
      }

      let {setLoading, renameFolder, renameFile, toggleElement} = this.props
      let {info} = this
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
           <form onSubmit={(e)=>this.handleSubmit(e, info.function)}>
             <ModalHeader>{info.title}</ModalHeader>
             <ModalBody>
                  <Container fluid>
                    <Row>
                      <Col xs='auto' className='mx-auto'><div className="modal__icon"><i class={info.iconClass}></i></div></Col>
                      <div className="w-100 modal__break-line"></div>
                      <Col className='d-flex align-items-center'>
                        <div className="input w-100">
                        <Input 
                          type='text' name='name' className='input__field'
                          onChange={this.handleInput} value={this.state.name} 
                          placeholder={info.placeHolder} autoComplete="off"
                          onFocus={e=>e.target.select()}></Input>
                          <p className="input__error">this field is not correct fulfield</p>
                        </div>
                          
                      </Col>

                    </Row>
                  </Container>
             </ModalBody>
             <ModalFooter>
               <Button color="secondary modal__btn" onClick={toggle}>Cancel</Button>{' '}
               <Button color="primary modal__btn" type='submit'>Save</Button>
             </ModalFooter>
             </form>
           </Modal>
         </div>
       );
   }
}
