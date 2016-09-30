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
function printVizArray(){
  var str = ''
  vizArray.forEach(function(x){
    str += x.label
  })
  console.log(`[${str}]`);
}

let transition = function(){
  //kill current viz
  stageHolder['stage' + (canvasCount - 1)].destroy()

  currentViz = V.swapForNewArrayItem(currentViz, vizArray)

  //get random viz, set current
  // var randNum = V.zeroToRand(vizArray.length - 1)
  // let lastViz = currentViz
  //
  // //push old current, slice out new current
  // vizArray.splice(randNum, 1);
  // vizArray.push(lastViz)
  // console.log('pushed', lastViz.label);
  // currentViz = vizArray[randNum]
  printVizArray()

  //init stage
  stageHolder['stage' + canvasCount] = Stage(currentViz)
  stageHolder['stage' + canvasCount].init();


}

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------

init();
