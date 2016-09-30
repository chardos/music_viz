import {analyser, audioElement, getAudioData} from '../helpers/audio.js';
import {deepExtend} from '../helpers.js';

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

  function Line(){
    var x = Math.ceil(Math.random() * windowWidth)
    var y = Math.ceil(Math.random() * innerHeight)
    this.lineWidth = random(1,6);
  	this.direction = getRandomDirection( random(0,3) );
  	// var direction = getRandomDirection( random(0,3) );
  	this.secondsTilChange = random(1,4) * 60;
  	this.lastPosition = null;
  	this.currentPosition = {x, y};
  }

  Line.prototype.draw = function (last, current, lineWidth, ctx){
  	ctx.beginPath();
  	ctx.moveTo(last.x, last.y);
  	ctx.lineTo(current.x, current.y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#ff0000';
  	ctx.stroke();
  	ctx.closePath();
  }

  function move(pos, direction){
  	if(direction == 'up'){
  		return { x: pos.x, y: pos.y - 1};
  	}
  	else if(direction == 'right'){
  		return { x: pos.x + 1, y: pos.y };
  	}
  	else if( direction == 'down' ){
  		return { x: pos.x, y: pos.y + 1 };
  	}
  	else if( direction == 'left' ){
  		return { x: pos.x - 1, y: pos.y };
  	}
  }

  function getRandomDirection(n){
  	var directions = ['up', 'right', 'down', 'left'];
  	return directions[n];
  }
  function turnLeftOrRight(direction, n){
  	var directions = ['up', 'right', 'down', 'left'];
  	var direction = directions.indexOf(direction)
  	if(n == 0){ //left
  		direction--;
  	}
  	else{ //right
  		direction++;
  	}
  	if(direction == 4) direction = 0;
  	if(direction == -1) direction = 3;
  	return directions[direction]
  }

  function wrapAround(pos, lastPos){
    //sends line to other side of screen if goes out of bounds
  	if(pos.x > windowWidth){
  		pos.x = 0;
  		lastPos.x = 0;
  	}
  	if(pos.x < 0){
  		pos.x = windowWidth;
  		lastPos.x = windowWidth;
  	}
  	if(pos.y > windowHeight){
  		pos.y = 0;
  		lastPos.y = 0;
  	}
  	if(pos.y < 0){
  		pos.y = windowHeight;
  		lastPos.y = windowHeight;
  	}
  	return [pos, lastPos];
  }

  function random(a, b){
  	var range = b - a + 1;
  	return Math.floor(Math.random()*range) + a;
  }


  return{
    setup,
    teardown,
    label: 'Lines'
  }
}())
