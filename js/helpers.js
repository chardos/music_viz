var V = V || {};


export function zeroToRand(num){
  return Math.ceil(Math.random()*(num + 1)) - 1;
}

export function random(a, b){
  var range = b - a + 1;
  return Math.floor(Math.random()*range) + a;
}

 export function swapForNewArrayItem(currItem, arr){
  var rand = Math.ceil(Math.random()*(arr.length)) - 1
  arr.push(currItem);
  var newItem = arr.splice(rand, 1);
  return newItem[0];
}

//calc fps
export function calcFPS(){
 if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (new Date().getTime() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = Math.ceil(1/delta);
  document.getElementById('fps').innerHTML = fps + 'fps';
}

export function deepExtend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};



// there isn't a built in circle particle renderer f
// so we have to define our own.

// function particleRender( context ) {
//   // we get passed a reference to the canvas context
//   context.beginPath();
//   // and we just have to draw our shape at 0,0 - in this
//   // case an arc from 0 to 2Pi radians or 360º - a full circle!
//   context.arc( 0, 0, 1, 0,  Math.PI * 2, true );
//   context.fill();
// };


// called when the mouse moves
function updateMouseCoords( event ) {
  // store the mouseX and mouseY position
  mouseX = event.clientX;
  mouseY = event.clientY;
}



function s(){ // stop
  clearInterval(int);
  clearInterval(changeViewInt);
  audioElement.pause();
}
document.addEventListener("click", function(){
 s();
});

export function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function initFullScreenHandlers(){
  var elem = document.body; // Make the body go full screen.

  document.getElementById("fullscreen").addEventListener("click", function(){
    _requestFullScreen(elem);
  });

  // document.addEventListener("fullscreenchange", _FShandler);
  // document.addEventListener("webkitfullscreenchange", _FShandler);
  // document.addEventListener("mozfullscreenchange", _FShandler);
  // document.addEventListener("MSFullscreenChange", _FShandler);
}

function _requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

export function printVizArray(){
  var str = ''
  vizArray.forEach(function(x){
    str += x.label
  })
  console.log(`[${str}]`);
}


function _FShandler(){
  renderer.setSize( window.innerWidth, window.innerHeight );
  setTimeout(function(){
    renderer.setSize( window.innerWidth, window.innerHeight );
  },1500)
}
