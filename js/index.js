import starburst from './starburst/main.js';
import wave from './wave/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  fftSize: 512
}

let vizArray = [starburst, wave],
    currentViz = wave,
    canvasCount = 0

window.lastCalledTime = null;
window.windowWidth = window.innerWidth;
window.windowHeight = window.innerHeight;

function Stage(currentViz){
  let canvas = document.createElement('canvas')
  return{
    init: function(){
      canvas.id = `canvas${canvasCount}`
      currentViz.setup(canvas, mainConfig)
      canvasCount++;
    },
    destroy: function(){
      currentViz.teardown()
      canvas.parentNode.removeChild(canvas)
    }
  }
}
let init = function() {
  let stage = Stage(starburst)
  stage.init();

  // NOTE TO SELF: Once you set a settimeout between destroy and init, the memory leak has dissappeared
  // window.yo = setInterval(function(){
  //   stage.destroy();
  //   setTimeout(function(){
  //     stage.init();
  //   },5)
  // },200)
  // let stage2 = Stage(wave)
  // stage2.init();
}

// function update() {
//   renderer.render( scene, camera ); // and render the scene from the perspective of the camera
//   currentViz.updateFrame();
//   calcFPS();
// }

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
