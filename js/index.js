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


let init = function() {
  let canvas = document.createElement('canvas');
  currentViz.init(canvas, mainConfig);
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
