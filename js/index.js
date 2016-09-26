import starburst from './starburst/main.js';
import wave from './wave/main.js';
import {setup3dScene} from './helpers/3d.js';

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
// the main three.js components
window.camera = null
window.renderer = null
window.scene = null

window.mouseX = 0;
window.mouseY = 0;


let init = function() {
  setup3dScene();
  let canvas = document.createElement('canvas');
  startViz(canvas);

  window.int = setInterval(update,1000/mainConfig.fps);
}


function update() {
  renderer.render( scene, camera ); // and render the scene from the perspective of the camera
  currentViz.updateFrame();
  calcFPS();
}


function startViz(){
  // create the canvas, pass it into the currentviz
  // WRITE CODE

  //init currentviz with canvas
  currentViz.init();
}


// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
