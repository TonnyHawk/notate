import React, { Component } from 'react';

class Preloader extends Component {

   animate=()=>{
      window.anime.timeline({loop: false})
   .add({
      targets: '.preloader',
      top: 0,
      easing: "easeOutExpo",
      duration: 1300
   })
  .add({
    targets: '.ml11 .line',
    scaleY: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 500,
    delay: 300
  })
  .add({
    targets: '.ml11 .line',
    translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
    easing: "easeOutExpo",
    duration: 700,
    delay: 100
  }).add({
    targets: '.ml11 .letter',
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=775',
    delay: (el, i) => 34 * (i+1)
  }).add({
    targets: '.ml11 .line',
    opacity: 0,
    easing: "easeOutExpo",
    duration: 700
  })
  .add({
    targets: '.preloader',
    top: '100vh',
    easing: "easeOutExpo",
    duration: 1300,
    delay: 700
  })
   }

   componentDidUpdate(prevProps, prevState) {
      if(this.props.show){
         this.animate()
      }
   }
   
   
   render() {
      

      return (
         <div class={`preloader`}>
         <h1 class="ml11">
           <span class="text-wrapper">
             <span class="line line1"></span>
             <span class="letters"><span class="letter">n</span><span class="letter">o</span><span class="letter">t</span><span class="letter">a</span><span class="letter">t</span><span class="letter">e</span><span class="letter">.</span><span class="letter">i</span><span class="letter">o</span></span>
           </span>
         </h1>
       </div>
      );
   }
}

export default Preloader;