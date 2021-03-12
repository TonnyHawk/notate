import React, { Component } from 'react';

class File extends Component {

   state = {
      fileName: null,
      txt: null
   }

   title = React.createRef();
   txt = React.createRef();

   handleSubmit=(e)=>{
      e.preventDefault();
      this.props.createFile(this.title.current.value, this.txt.current.value)
      // this.title.current.value = ''
      // this.txt.current.value = ''
   }

   render() {

      let optCl = ''

      if(this.props.state){
         optCl+= ' active';
      }
      
      return (
         <form action="" class={`file${optCl}`} onSubmit={this.handleSubmit}>
            <div class="file__header">
            <input 
                  type='text' name='file_name' class="input file__name-field" placeholder='file name'
                  ref={this.title}/>
            <div class="file__actions">
               <button type='submit' class="file__action action-btn"><i class="far fa-save"></i></button>
            </div>
            </div>
            <div class="file__body">
            <textarea 
               name="file_txt" id="" class="file__textarea" placeholder='type here...' 
               ref={this.txt}
               ></textarea>
            </div>
         </form>
      );
   }
}

export default File;