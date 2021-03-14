import React, { Component } from 'react';

class File extends Component {

   state = {
      name: '',
      txt: '',
      currentFile: this.props.currentFile
   }

   titleElem = React.createRef();
   txtElem = React.createRef();

   handleSubmit=(e)=>{
      e.preventDefault();

      let title = this.titleElem.current.value
      let txt = this.txtElem.current.value
      let id = this.props.currentFile.id
      if(id === ''){
         this.props.createFile(title, txt)
      } else{
         this.props.createFile(title, txt, id)
      }
   }

   handleChange=(e, field)=>{
      this.setState({[field]: e.target.value})
   } 

   static getDerivedStateFromProps(props, state){
      let {name,txt,id} = props.currentFile
      if(state.currentFile !== props.currentFile){
         return {name, txt, id, currentFile: props.currentFile}
      } else return null
   }

   render() {
      let optCl = ''

      if(this.props.state){
         optCl+= ' active';
      }

      let {name, txt} = this.state

      return (
         <form action="" class={`file${optCl}`} onSubmit={this.handleSubmit}>
            <div class="file__header">
            <input 
                  type='text' name='file_name' class="input file__name-field" placeholder='file name'
                  ref={this.titleElem}
                  value={name}
                  onChange={(e)=>this.handleChange(e, 'name')}/>
            <div class="file__actions">
               <button type='submit' class="file__action action-btn"><i class="far fa-save"></i></button>
            </div>
            </div>
            <div class="file__body">
            <textarea 
               name="file_txt" id="" class="file__textarea" placeholder='type here...' 
               ref={this.txtElem}
               value={txt}
               onChange={(e)=>this.handleChange(e, 'txt')}
               ></textarea>
            </div>
         </form>
      );
   }
}

export default File;