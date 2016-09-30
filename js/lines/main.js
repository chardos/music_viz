import {analyser, audioElement, getAudioData} from '../helpers/audio.js';
import {Line, move, wrapAround, turnLeftOrRight} from './helpers.js';
import {deepExtend, random} from '../helpers.js';

let lines = [],
    ctx,
    playing;

export default (function(){

  function setup(canvas, mainConfig) {
    playing = true;
    document.body.appendChild(canvas);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    lines = []
    for(var i = 0; i<150; i++){
    	lines.push( new Line() );
    }

    requestAnimationFrame(updateFrame);
  }

  function updateFrame() {
    lines.forEach(function(line){
  		if(line.lastPosition){
  			line.draw(line.lastPosition, line.currentPosition, line.lineWidth, ctx);
  		}
  		//set new positions
  		line.lastPosition = deepExtend({}, line.currentPosition); //deep copy current pos
  		line.currentPosition = move(line.currentPosition, line.direction);
  		//wrap positions if necessary
  		[line.currentPosition, line.lastPosition] = wrapAround(line.currentPosition, line.lastPosition)

  		line.secondsTilChange--;
  		if(line.secondsTilChange <= 0){
  			line.secondsTilChange = random(3,6) * 60;
  			line.direction = turnLeftOrRight( line.direction, random(0,1) );
  		}
  		// line.lineWidth += .02;
  	})

    if(playing){
      requestAnimationFrame(updateFrame);
    }
  }

  function teardown() {
    playing = false;
  }






  return{
    setup,
    teardown,
    label: 'Lines'
  }
}())
