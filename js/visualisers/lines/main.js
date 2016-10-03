import {analyser, audioElement, getAudioData} from '../../helpers/audio.js';
import {move, wrapAround, turnLeftOrRight, getColor, getRandomDirection} from './lineHelpers.js';
import {deepExtend, random} from '../../helpers.js';

let config = {
  numLines: 360
}

let lines = [],
    ctx,
    playing,
    baseHue;

export default (function(){

  function setup(canvas, mainConfig) {
    playing = true;
    baseHue = random(1,360);
    document.body.appendChild(canvas);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    lines = []
    for(var i = 0; i<config.numLines; i++){
    	lines.push( new Line() );
    }

    requestAnimationFrame(updateFrame);
  }

  function updateFrame() {

    let audioData = getAudioData();
    let volume = audioData.currentVolume;
    let frequencyData = audioData.frequencyData;

    lines.forEach(function(line, index){
  		if(line.lastPosition){
        let lineWidth = (frequencyData[index] / 30 ) + 1
        let strokestyle = getColor(baseHue + line.variance, line.saturation, line.lightness, volume/45 + 0.3)
  			line.draw(line.lastPosition, line.currentPosition, lineWidth, strokestyle, ctx);
  		}
  		//set new positions
  		line.lastPosition = deepExtend({}, line.currentPosition); //deep copy current pos
  		line.currentPosition = move(line.currentPosition, line.direction, frequencyData[index] * frequencyData[index] / 10000);
  		//wrap positions if necessary
  		[line.currentPosition, line.lastPosition] = wrapAround(line.currentPosition, line.lastPosition)

  		line.secondsTilChange--;
  		if(line.secondsTilChange <= 0){
  			line.secondsTilChange = random(3,6) * 60;
  			line.direction = turnLeftOrRight( line.direction, random(0,1) );
  		}
  		// line.lineWidth += .02;
  	})

    baseHue += .02;

    if(playing){
      requestAnimationFrame(updateFrame);
    }
  }

  function teardown() {
    playing = false;
  }

  function Line(){
    let x = Math.ceil(Math.random() * windowWidth)
    let y = Math.ceil(Math.random() * innerHeight)
    this.variance = random(-30,30)
    this.saturation = random(60,100)
    if(random(0,2) === 0){
      this.lightness = random(15,50)
    }
    else{
      this.lightness = 0;
    }

    this.lineWidth = 1;
    this.direction = getRandomDirection( random(0,3) );
    this.color = getColor(baseHue + this.variance, this.saturation, this.lightness)
    this.secondsTilChange = random(1,4) * 60;
    this.lastPosition = null;
    this.currentPosition = {x, y};
  }

  Line.prototype.draw = function (last, current, lineWidth, strokeStyle, ctx){
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(current.x, current.y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.closePath();
  }




  return{
    setup,
    teardown,
    label: 'Lines'
  }
}())
