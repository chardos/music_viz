import {zeroToRand, swapForNewArrayItem, initFullScreenHandlers} from './helpers.js';
import starburst from './starburst/main.js';
import wave from './wave/main.js';
import lines from './lines/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  fftSize: 512
}

let vizArray = [starburst, wave, lines],
    currentViz,
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
      console.log('id',canvas.id);
      viz.setup(canvas, mainConfig)
      canvasCount++;
    },
    destroy: function(){
      viz.teardown()
      // canvas.parentNode.removeChild(canvas)
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
let init = function() {
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
  },10000)

}
function printVizArray(){
  var str = ''
  vizArray.forEach(function(x){
    str += x.label
  })
  console.log(`[${str}]`);
}

let transition = function(){
  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.opacity = 0;
  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.zIndex = 10;

  (function(canvasCount){
    setTimeout(function(){
      console.log('count', canvasCount);
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

init();
