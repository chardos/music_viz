import starburst from './starburst/main.js';
import wave from './wave/main.js';

//config
window.V = V || {};

V.config = {
  viz: 1,
  fps: 60,
  fftSize: 512
}

V.vizArray = [starburst, wave]

window.lastCalledTime = null;
window.windowWidth = window.innerWidth;
window.windowHeight = window.innerHeight;
// the main three.js components
window.camera = null
window.renderer = null
window.scene = null

window.mouseX = 0;
window.mouseY = 0;


V.init = function() {
  var cfg = V.config;
  V.setup3dScene();

  V.startViz();

  // add the mouse move listener
  document.addEventListener( 'mousemove', updateMouseCoords, false );
  window.int = setInterval(update,1000/V.config.fps);

  // changeVizint = setInterval(function(){
  //   //reset viz
  //   var currentViz = V[V.vizArray[V.config.viz]];
  //   currentViz.reset();
  //
  //   //reset scene
  //   element = document.querySelectorAll("canvas");
  //   element[0].parentNode.removeChild(element[0]);
  //   V.setup3dScene();
  //
  //   //set viz
  //   cfg.viz++;
  //   if (cfg.viz >= V.vizArray.length){
  //     cfg.viz = 0;
  //   }
  //   V.startViz();
  // },3500)



  renderer.render( scene, camera );

}


function update() {
  renderer.render( scene, camera ); // and render the scene from the perspective of the camera
  //*******THIS CHANGES**********
  var currentViz = V.vizArray[V.config.viz];
  currentViz.updateFrame();
  calcFPS();
}

V.startViz = function(){
  //*******THIS CHANGES**********
  var currentViz = V.vizArray[V.config.viz];
  currentViz.init();
}

V.setup3dScene = function() {
  // field of view, aspect ratio for render output, near and far clipping plane.
  camera = new THREE.PerspectiveCamera(80, windowWidth / window.innerHeight, 1, 4000 );
  camera.position.z = 200;

  // the scene contains all the 3D object data
  scene = new THREE.Scene();

  // camera needs to go in the scene
  scene.add(camera);

  // and the CanvasRenderer figures out what the
  // stuff in the scene looks like and draws it!
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  // the renderer's canvas domElement is added to the body
  document.body.appendChild( renderer.domElement );
}

// --------------------------------------------------------------------------
// AUDIO STARTS HERE
// --------------------------------------------------------------------------



V.init();
