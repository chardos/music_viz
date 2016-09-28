import starburst from './starburst/main.js';
import wave from './wave/main.js';

//mainConfig

let mainConfig = {
  fps: 60,
  fftSize: 512
}

let vizArray = [starburst, wave],
    currentViz,
    stageHolder = {},
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
  //get random viz, set current and remove it from the array
  var randNum = V.zeroToRand(vizArray.length - 1)
  currentViz = vizArray[randNum]
  vizArray.splice(randNum, 1);

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();

  setInterval(function(){
    transition();
  },2000)


  // let stage = Stage(wave)
  // stage.init();
  //
  // setInterval(function(){
  //   stage.destroy();
  //   setTimeout(function(){
  //     stage.init();
  //   },100)
  // },2000)

  // let stage2 = Stage(wave)
  // stage2.init();
}

let transition = function(){
  //kill current viz
  stageHolder['stage' + (canvasCount - 1)].destroy()

  //get random viz, set current
  var randNum = V.zeroToRand(vizArray.length - 1)
  currentViz = vizArray[randNum]

  //push old current, slice out new current
  vizArray.push(currentViz)
  vizArray.splice(randNum, 1);

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();


}

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
