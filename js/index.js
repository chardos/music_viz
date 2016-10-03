import {zeroToRand, swapForNewArrayItem, initFullScreenHandlers} from './helpers.js';
import starburst from './visualisers/starburst/main.js';
import wave from './visualisers/wave/main.js';
import lines from './visualisers/lines/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  vizDuration: 20,
  fftSize: 512
}

let currentViz,
    vizArray = [starburst, lines, wave],
    // vizArray = [lines],
    canvasCount = 0

window.stageHolder = {};
window.lastCalledTime = null;
window.windowWidth = window.innerWidth;
window.windowHeight = window.innerHeight;

function Stage(viz){
  let canvas = document.createElement('canvas')
  return{
    init: function(){
      canvas.id = `canvas${canvasCount}`
      viz.setup(canvas, mainConfig)
      canvasCount++;
    },
    destroy: function(){
      viz.teardown()
      document.querySelector('canvas').remove()
    },
    getLabel: function(){
      return viz.label
    },
    getCanvas: function(){
      return canvas
    }
  }
}
let mainInit = function() {
  initFullScreenHandlers();
  //get random viz, set current and remove it from the array
  var randNum = zeroToRand(vizArray.length - 1)
  currentViz = vizArray[randNum]
  vizArray.splice(randNum, 1);

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();

  setInterval(function(){
    transition();
  },mainConfig.vizDuration * 1000)

}


let transition = function(){
  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.opacity = 0;
  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.zIndex = 10;

  (function(canvasCount){
    setTimeout(function(){
      stageHolder['stage' + (canvasCount - 1)].destroy()
    },2500)
  }(canvasCount))

  currentViz = swapForNewArrayItem(currentViz, vizArray)

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();


}

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

mainInit();
