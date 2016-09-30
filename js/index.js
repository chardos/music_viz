import starburst from './starburst/main.js';
import wave from './wave/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  fftSize: 512
}

let vizArray = [starburst, wave],
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
  console.log('In/itTED');
  //get random viz, set current and remove it from the array
  var randNum = V.zeroToRand(vizArray.length - 1)
  currentViz = vizArray[randNum]
  vizArray.splice(randNum, 1);
  printVizArray();

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();

  setInterval(function(){
    transition();
  },8000)


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
  console.log('count', canvasCount);
  (function(canvasCount){
    setTimeout(function(){
      console.log('count', canvasCount);
      stageHolder['stage' + (canvasCount - 1)].destroy()
    },2500)
  }(canvasCount))
  currentViz = V.swapForNewArrayItem(currentViz, vizArray)

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();


}

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
