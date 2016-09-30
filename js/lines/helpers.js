import {random} from '../helpers.js';

export function Line(){
  var x = Math.ceil(Math.random() * windowWidth)
  var y = Math.ceil(Math.random() * innerHeight)
  this.lineWidth = random(1,6);
  this.direction = getRandomDirection( random(0,3) );
  let hue = random(1,360)
  let saturation = random(60,100)
  let lightness = random(15,50)
  this.color = `hsl(${hue},${saturation}%,${lightness}%)`
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
  ctx.lineCap = 'round';
  ctx.strokeStyle = this.color;
  ctx.stroke();
  ctx.closePath();
}

export function move(pos, direction){
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
export function turnLeftOrRight(direction, n){
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

export function wrapAround(pos, lastPos){
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
