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
  return{
    init: function(){
      let canvas = document.createElement('canvas')
      canvas.id = `canvas${canvasCount}`
      canvasCount++;
      currentViz.init(canvas, mainConfig)
    }
  }
}
let init = function() {
  let stage = Stage(starburst)
  stage.init();
  let stage2 = Stage(wave)
  stage2.init();
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
