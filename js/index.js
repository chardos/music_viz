import starburst from './starburst/main.js';
import wave from './wave/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  fftSize: 512
}

let vizArray = [starburst, wave],
    currentViz = starburst,
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
  let stage = Stage(currentViz)
  stage.init();

  // let stage2 = Stage(wave)
  // stage2.init();
}

let transition = function(){

}

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
