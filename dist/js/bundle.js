/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _helpers = __webpack_require__(1);

	var _main = __webpack_require__(2);

	var _main2 = _interopRequireDefault(_main);

	var _main3 = __webpack_require__(6);

	var _main4 = _interopRequireDefault(_main3);

	var _main5 = __webpack_require__(9);

	var _main6 = _interopRequireDefault(_main5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//mainConfig

	var mainConfig = {
	  fps: 60,
	  vizDuration: 9,
	  fftSize: 512
	};

	var currentViz = void 0,
	    vizArray = [_main2.default, _main6.default, _main4.default],

	// vizArray = [lines],
	canvasCount = 0;

	window.stageHolder = {};
	window.lastCalledTime = null;
	window.windowWidth = window.innerWidth;
	window.windowHeight = window.innerHeight;

	function Stage(viz) {
	  var canvas = document.createElement('canvas');
	  return {
	    init: function init() {
	      canvas.id = 'canvas' + canvasCount;
	      viz.setup(canvas, mainConfig);
	      canvasCount++;
	    },
	    destroy: function destroy() {
	      viz.teardown();
	      document.querySelector('canvas').remove();
	    },
	    getLabel: function getLabel() {
	      return viz.label;
	    },
	    getCanvas: function getCanvas() {
	      return canvas;
	    }
	  };
	}
	var mainInit = function mainInit() {
	  (0, _helpers.initFullScreenHandlers)();
	  //get random viz, set current and remove it from the array
	  var randNum = (0, _helpers.zeroToRand)(vizArray.length - 1);
	  currentViz = vizArray[randNum];
	  vizArray.splice(randNum, 1);

	  //init stage
	  stageHolder['stage' + canvasCount] = Stage(currentViz);
	  stageHolder['stage' + canvasCount].init();

	  setInterval(function () {
	    transition();
	  }, mainConfig.vizDuration * 1000);
	};

	var transition = function transition() {
	  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.opacity = 0;
	  stageHolder['stage' + (canvasCount - 1)].getCanvas().style.zIndex = 10;

	  (function (canvasCount) {
	    setTimeout(function () {
	      stageHolder['stage' + (canvasCount - 1)].destroy();
	    }, 2500);
	  })(canvasCount);

	  currentViz = (0, _helpers.swapForNewArrayItem)(currentViz, vizArray);

	  //init stage
	  stageHolder['stage' + canvasCount] = Stage(currentViz);
	  stageHolder['stage' + canvasCount].init();
	};

	// --------------------------------------------------------------------------
	// Start
	// --------------------------------------------------------------------------

	mainInit();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.zeroToRand = zeroToRand;
	exports.random = random;
	exports.swapForNewArrayItem = swapForNewArrayItem;
	exports.calcFPS = calcFPS;
	exports.deepExtend = deepExtend;
	exports.hslToRgb = hslToRgb;
	exports.initFullScreenHandlers = initFullScreenHandlers;
	exports.printVizArray = printVizArray;
	var V = V || {};

	function zeroToRand(num) {
	  return Math.ceil(Math.random() * (num + 1)) - 1;
	}

	function random(a, b) {
	  var range = b - a + 1;
	  return Math.floor(Math.random() * range) + a;
	}

	function swapForNewArrayItem(currItem, arr) {
	  var rand = Math.ceil(Math.random() * arr.length) - 1;
	  arr.push(currItem);
	  var newItem = arr.splice(rand, 1);
	  return newItem[0];
	}

	//calc fps
	function calcFPS() {
	  if (!lastCalledTime) {
	    lastCalledTime = Date.now();
	    fps = 0;
	    return;
	  }
	  delta = (new Date().getTime() - lastCalledTime) / 1000;
	  lastCalledTime = Date.now();
	  fps = Math.ceil(1 / delta);
	  document.getElementById('fps').innerHTML = fps + 'fps';
	}

	function deepExtend(out) {
	  out = out || {};

	  for (var i = 1; i < arguments.length; i++) {
	    var obj = arguments[i];

	    if (!obj) continue;

	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        if (_typeof(obj[key]) === 'object') out[key] = deepExtend(out[key], obj[key]);else out[key] = obj[key];
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
	function updateMouseCoords(event) {
	  // store the mouseX and mouseY position
	  mouseX = event.clientX;
	  mouseY = event.clientY;
	}

	function s() {
	  // stop
	  clearInterval(int);
	  clearInterval(changeViewInt);
	  audioElement.pause();
	}
	document.addEventListener("click", function () {
	  s();
	});

	function hslToRgb(h, s, l) {
	  var r, g, b;

	  if (s == 0) {
	    r = g = b = l; // achromatic
	  } else {
	    var hue2rgb = function hue2rgb(p, q, t) {
	      if (t < 0) t += 1;
	      if (t > 1) t -= 1;
	      if (t < 1 / 6) return p + (q - p) * 6 * t;
	      if (t < 1 / 2) return q;
	      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	      return p;
	    };

	    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	    var p = 2 * l - q;
	    r = hue2rgb(p, q, h + 1 / 3);
	    g = hue2rgb(p, q, h);
	    b = hue2rgb(p, q, h - 1 / 3);
	  }

	  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	function initFullScreenHandlers() {
	  var elem = document.body; // Make the body go full screen.

	  document.getElementById("fullscreen").addEventListener("click", function () {
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

	  if (requestMethod) {
	    // Native full screen.
	    requestMethod.call(element);
	  } else if (typeof window.ActiveXObject !== "undefined") {
	    // Older IE.
	    var wscript = new ActiveXObject("WScript.Shell");
	    if (wscript !== null) {
	      wscript.SendKeys("{F11}");
	    }
	  }
	}

	function printVizArray() {
	  var str = '';
	  vizArray.forEach(function (x) {
	    str += x.label;
	  });
	  console.log('[' + str + ']');
	}

	function _FShandler() {
	  renderer.setSize(window.innerWidth, window.innerHeight);
	  setTimeout(function () {
	    renderer.setSize(window.innerWidth, window.innerHeight);
	  }, 1500);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _helpers = __webpack_require__(3);

	var _audio = __webpack_require__(4);

	var _d = __webpack_require__(5);

	exports.default = function () {
	  var particles = void 0,
	      changeViewInterval = void 0,
	      currentVolume = void 0,
	      frequencyData = void 0,
	      camera = void 0,
	      scene = void 0,
	      renderer = void 0,
	      particleGeom = void 0,
	      material = void 0,
	      playing = void 0;

	  var config = {
	    panMultiplier: 300, //how much mouse affects pan
	    numberParticles: 15000,
	    baseZoom: 200
	  };

	  var vars = {
	    particleBaseSize: 0.7,
	    sphereFloor: 0,
	    sphereRange: 1,
	    baseHue: 0,
	    view: 0
	  };

	  //the init function called from the main.js
	  function setup(canvas, mainConfig) {
	    playing = true;
	    var threeD = (0, _d.setup3dScene)(canvas);
	    camera = threeD.camera;
	    scene = threeD.scene;

	    renderer = new THREE.WebGLRenderer({ canvas: canvas }); //dont create multiple renderers
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    document.body.appendChild(renderer.domElement);

	    particleGeom = new THREE.Geometry();
	    window.colors = [];

	    //CREATE THE SPHERE
	    for (var i = 0; i < config.numberParticles; i++) {

	      //create particle within half sphere
	      var x = -1 + Math.random() * 2;
	      var y = -1 + Math.random() * 2;
	      var z = Math.abs(-1 + Math.random() * 2); //abs = half sphere
	      var sphere = (0, _helpers.spherize)(x, y, z);

	      particleGeom.vertices.push(new THREE.Vector3());
	      particleGeom.vertices[i].origX = sphere.x;
	      particleGeom.vertices[i].origY = sphere.y;
	      particleGeom.vertices[i].origZ = sphere.z;

	      // vertex colors
	      colors[i] = new THREE.Color(1, 1, 1);
	      colors[i].setHSL(Math.random(), 1.0, 0.5);
	    }
	    particleGeom.colors = colors;
	    // material
	    material = new THREE.PointCloudMaterial({
	      size: vars.particleBaseSize,
	      vertexColors: THREE.VertexColors
	    });
	    particles = new THREE.PointCloud(particleGeom, material);
	    scene.add(particles);

	    changeViewInterval = setInterval(function () {
	      changeView();
	    }, 1500);
	    requestAnimationFrame(updateFrame);
	  }

	  function teardown() {
	    clearInterval(changeViewInterval);
	    playing = false;
	    scene.remove(particles);
	    particleGeom.dispose();
	    material.dispose();
	  }

	  function updateFrame() {
	    renderer.render(scene, camera); // and render the scene from the perspective of the camera

	    //AUDIO ------------------------------------
	    var audioData = (0, _audio.getAudioData)();


	    //PARTICLES ------------------------------------
	    currentVolume = audioData.currentVolume;
	    frequencyData = audioData.frequencyData;
	    particles.geometry.verticesNeedUpdate = true;
	    particles.geometry.colorsNeedUpdate = true;
	    var colors = []; //create the array that will house all the colors of each particle
	    var geometry = particles.geometry;
	    var fftSize = _audio.analyser.fftSize;

	    // iterate through every particle
	    for (var i = 0; i < particles.geometry.vertices.length; i++) {
	      var particle = particles.geometry.vertices[i];

	      //assign each particle to a FFT band
	      var fftBand = i % (fftSize / 2);
	      var amplitude = frequencyData[fftBand];

	      //make particles with 0 amplitude bounce to averagevolume
	      if (amplitude == 0) amplitude = currentVolume;

	      particle.x = particle.origX * amplitude * vars.sphereRange + particle.origX * vars.sphereFloor;
	      particle.y = particle.origY * amplitude * vars.sphereRange + particle.origY * vars.sphereFloor;
	      particle.z = particle.origZ * amplitude * vars.sphereRange + particle.origZ * vars.sphereFloor;

	      //colorize the particle
	      colors[i] = new THREE.Color();
	      var modifiedHue = vars.baseHue + frequencyData[fftBand] / 250;
	      colors[i].setHSL(modifiedHue, 1, .6);

	      //if no volume, blacken all particles.
	      if (currentVolume == 0) {
	        colors[i].setHSL(0, 0, 0);
	      }
	    }
	    vars.baseHue += +0.005;
	    if (vars.baseHue > 1) vars.baseHue = 0;
	    geometry.colors = colors;

	    //move cam up down out on mouseY
	    // var cameraOffset = mouseY/windowHeight - 0.5;
	    // camera.position.y = cameraOffset * config.panMultiplier;

	    //rotate cam left right on mouseX
	    // var cameraOffset = mouseX/windowWidth - 0.5;
	    // camera.position.x = cameraOffset * config.panMultiplier * -1;
	    camera.lookAt(new THREE.Vector3(0, 0, 0));

	    if (playing) {
	      requestAnimationFrame(updateFrame);
	    }
	  }

	  function changeView() {

	    if (vars.view == 0) {
	      vars.sphereFloor = 100;
	      vars.sphereRange = 0.6;
	      setTimeout(function () {
	        config.baseZoom = 300;
	      }, 700);
	    }
	    if (vars.view == 1) {
	      config.baseZoom = 175;
	      setTimeout(function () {
	        particles.material.size = vars.particleBaseSize * 2;
	      }, 700);
	      setTimeout(function () {
	        particles.material.size = vars.particleBaseSize = 0.7;
	      }, 1200);
	    }
	    if (vars.view == 2) {
	      vars.sphereFloor = 0;
	      vars.sphereRange = 1;
	      setTimeout(function () {
	        config.baseZoom = 100;
	      }, 700);
	      setTimeout(function () {
	        config.baseZoom = 300;
	        vars.sphereFloor = 120;
	        vars.sphereRange = .05;
	      }, 1200);
	    }
	    if (vars.view == 3) {
	      vars.sphereFloor = 50;
	      vars.sphereRange = 1;
	      config.baseZoom = 200;
	      setTimeout(function () {
	        vars.sphereFloor = 80;
	        config.baseZoom = 500;
	      }, 300);
	      setTimeout(function () {
	        config.baseZoom = 500;
	      }, 700);
	      setTimeout(function () {
	        config.baseZoom = 200;
	      }, 1200);
	    }
	    if (vars.view == 4) {
	      vars.sphereFloor = 120;
	      vars.sphereRange = .05;
	      setTimeout(function () {
	        config.baseZoom = 160;
	      }, 1300);
	    }
	    vars.view++;
	    if (vars.view > 4) {
	      vars.view = 0;
	    }
	  }

	  return {
	    setup: setup,
	    teardown: teardown,
	    renderer: renderer,
	    label: 'Starburst'
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var spherize = exports.spherize = function spherize(x, y, z) {
	  var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	  x *= d;
	  y *= d;
	  z *= d;
	  return { x: x, y: y, z: z };
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getAudioData = getAudioData;
	var context = exports.context = new AudioContext();
	var audioElement = exports.audioElement = document.getElementById("player");
	var analyser = exports.analyser = context.createAnalyser();
	analyser.fftSize = 512;

	function getAudioData() {
	  // could turn this into an audio object with decorators like get average vol
	  var frequencyData = getFreqData(analyser);
	  var currentVolume = 0;
	  for (var i = 0; i < frequencyData.length; i++) {
	    currentVolume += frequencyData[i];
	  }
	  currentVolume /= analyser.fftSize;
	  return { frequencyData: frequencyData, currentVolume: currentVolume };
	}

	var source = context.createMediaElementSource(audioElement);
	source.connect(analyser);
	source.connect(context.destination);

	function getFreqData(analyser) {
	  var data = new Uint8Array(analyser.frequencyBinCount);
	  analyser.getByteFrequencyData(data);
	  return data;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setup3dScene = setup3dScene;
	function setup3dScene() {
	  // field of view, aspect ratio for render output, near and far clipping plane.
	  var camera = new THREE.PerspectiveCamera(80, windowWidth / window.innerHeight, 1, 4000);
	  camera.position.z = 200;

	  // the scene contains all the 3D object data
	  var scene = new THREE.Scene();
	  scene.add(camera);

	  return { camera: camera, scene: scene };
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _waveEffects = __webpack_require__(7);

	var _waveEffects2 = _interopRequireDefault(_waveEffects);

	var _audio = __webpack_require__(4);

	var _waveViews = __webpack_require__(8);

	var _d = __webpack_require__(5);

	var _helpers = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var particles = void 0,
	    particleGeom = void 0,
	    frequencyData = void 0,
	    currentVolume = void 0,
	    camera = void 0,
	    scene = void 0,
	    renderer = void 0,
	    material = void 0,
	    colors = void 0,
	    columnNum = void 0,
	    currentEffect = void 0,
	    changeViewInt = void 0,
	    playing = void 0;

	exports.default = function () {
	  var config = {
	    particleBaseSize: 3,
	    panMultiplier: 1400, //how much mouse affects pan
	    height: 128, //128 // number of particles high
	    width: 500,
	    spacing: 8,
	    baseCamX: -600,
	    baseCamY: -400,
	    baseCamZ: 700,
	    coolOffPeriod: 2500,
	    bigBeatSensitivity: 3 //lower is more sensitive
	  };
	  var vars = {
	    heightToFFTratio: null,
	    baseHue: Math.random(),
	    lastVolume: 500, //random large number
	    cooledOff: true
	  };

	  function setup(canvas, mainConfig) {
	    columnNum = 0;
	    playing = true;
	    var threeD = (0, _d.setup3dScene)(canvas);
	    camera = threeD.camera;
	    scene = threeD.scene;

	    window.p = camera.position;
	    window.c = camera;
	    window.config = config;
	    renderer = new THREE.WebGLRenderer({ canvas: canvas }); //dont create multiple renderers
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    document.body.appendChild(renderer.domElement);
	    particleGeom = new THREE.Geometry();
	    colors = [];
	    camera.position.x = config.baseCamX;
	    camera.position.y = config.baseCamY;
	    camera.position.z = config.baseCamZ;
	    var fftSize = _audio.analyser.fftSize;

	    //set ratio
	    vars.heightToFFTratio = fftSize / config.height;

	    //CREATE THE PARTICLE GRID
	    for (var i = 0; i < config.width; i++) {
	      for (var i2 = 0; i2 < config.height; i2++) {
	        //create sheet of particles
	        var x = i * config.spacing;
	        var y = i2 * config.spacing;
	        var z = 0;

	        particleGeom.vertices.push(new THREE.Vector3());
	        var index = i * config.height + i2;
	        particleGeom.vertices[index].x = x;
	        particleGeom.vertices[index].y = y - config.height * config.spacing / 2;
	        particleGeom.vertices[index].z = z;
	        particleGeom.vertices[index].baseZ = z;

	        // vertex colors
	        colors[index] = new THREE.Color();
	        var hue = Math.random();
	        colors[index].setHSL(hue, 1.0, 0); //Set lightness to darken particles
	        particleGeom.vertices[index].hue = hue;
	      }
	    }
	    particleGeom.colors = colors; // TANZ

	    // material
	    material = new THREE.PointCloudMaterial({
	      size: config.particleBaseSize,
	      vertexColors: THREE.VertexColors,
	      sizeAttenuation: true
	    });

	    particles = new THREE.PointCloud(particleGeom, material);
	    console.log(particles);
	    scene.add(particles);
	    console.log(particles);

	    changeView();
	    changeViewInt = setInterval(changeView, 2000);

	    requestAnimationFrame(updateFrame);
	  }

	  function teardown() {
	    playing = false;
	    particleGeom.dispose();
	    material.dispose();
	    scene.remove(particles);
	    columnNum = 0;
	    clearInterval(changeViewInt);
	  }

	  function updateFrame() {
	    renderer.render(scene, camera); // and render the scene from the perspective of the camera

	    //AUDIO ------------------------------------
	    var audioData = (0, _audio.getAudioData)();


	    //BIG BEAT DETECTION------------------------
	    currentVolume = audioData.currentVolume;
	    frequencyData = audioData.frequencyData;
	    vars.lastVolume = currentVolume;

	    //PARTICLES ------------------------------------
	    particles.geometry.verticesNeedUpdate = true;
	    particles.geometry.colorsNeedUpdate = true;

	    var currentColumn = selectColumn(columnNum);
	    columnNum++;
	    if (columnNum >= config.width) {
	      columnNum = 0;
	    }

	    stylizeColumn(currentColumn);
	    shiftParticlesLeft(config, vars);
	    if (currentEffect) {
	      currentEffect(config, camera, particles, currentVolume);
	    }

	    vars.baseHue += 0.0003;
	    if (vars.baseHue > 1) {
	      vars.baseHue = 0;
	    };

	    // camera.lookAt(new THREE.Vector3(-500,0,0));
	    // camera.lookAt(new THREE.Vector3(camera.position.x,-100,0));

	    if (playing) {
	      requestAnimationFrame(updateFrame);
	    }
	  }

	  function selectColumn(index) {
	    var column = {};
	    var height = config.height;
	    column.particles = [];
	    column.indices = [];
	    var startI = height * index;
	    var endI = height * index + height;
	    for (var i = startI; i < endI; i++) {
	      column.particles.push(particles.geometry.vertices[i]);
	      column.indices.push(i);
	    }
	    return column;
	  }

	  function shiftParticlesLeft(config, vars) {
	    // move particles to the left
	    for (var i = 0; i < particles.geometry.vertices.length; i++) {
	      var particle = particles.geometry.vertices[i];
	      particle.x -= config.spacing;
	      if (particle.x < config.width * config.spacing * -1) {
	        particle.x = 0 - config.spacing;
	      }
	    }
	  }

	  function stylizeColumn(currentColumn) {
	    //set z values + colors
	    for (var i = 0; i < currentColumn.particles.length; i++) {
	      var particle = currentColumn.particles[i];
	      var index = currentColumn.indices[i];

	      //assign each particle to a FFT band
	      var fftBand = i % (_audio.analyser.fftSize / vars.heightToFFTratio);
	      var amplitude = frequencyData[fftBand];
	      var lightness = amplitude / 255;
	      // amplitude = (amplitude * amplitude * amplitude) / 90000

	      particle.z = amplitude;
	      particle.baseZ = amplitude;

	      //colorize the particle
	      colors[index] = new THREE.Color();
	      var modifiedHue = vars.baseHue + frequencyData[fftBand] / 600;
	      colors[index].setHSL(modifiedHue, 1, lightness);
	    }
	  }

	  function changeView() {
	    loadNewView();
	    loadNewEffect();
	  }
	  function loadNewView() {
	    var rand = (0, _helpers.random)(0, _waveViews.views.length - 1);
	    (0, _waveViews.viewRunner)(_waveViews.views[rand], camera, config);
	  }
	  function loadNewEffect() {
	    // currentEffect = effects[3]
	    var rand = (0, _helpers.random)(0, 1);
	    if (rand) {
	      currentEffect = false;
	    } else {
	      var _rand = (0, _helpers.random)(0, _waveEffects2.default.length - 1);
	      currentEffect = _waveEffects2.default[_rand];
	    }
	  }

	  return {
	    setup: setup,
	    teardown: teardown,
	    renderer: renderer,
	    label: 'Wave'
	  };
	}();

	//inspiration from: https://3bits.net/

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _helpers = __webpack_require__(1);

	function stutterCamX(config, camera, particles, currentVolume) {
	  camera.position.x = config.baseCamX + currentVolume * 3;
	}

	function pulseAmplitude(config, camera, particles, currentVolume) {
	  particles.geometry.vertices.forEach(function (particle) {
	    particle.z = particle.baseZ * currentVolume / 50 - 100;
	  });
	}

	function fuzzy(config, camera, particles, currentVolume) {
	  particles.geometry.vertices.forEach(function (particle) {
	    var rand = (0, _helpers.random)(-10, 10);
	    particle.z = particle.baseZ + rand;
	  });
	}

	var effects = [stutterCamX, pulseAmplitude, fuzzy];
	exports.default = effects;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.viewRunner = viewRunner;
	var view1 = {
	  cam: [-700, 0, 500],
	  camLookAt: [-700, 0, 500]
	};
	var view2 = {
	  cam: [-600, -400, 700],
	  camLookAt: [-600, -100, 0]
	};
	var view3 = {
	  cam: [-2000, 0, 400],
	  camLookAt: [0, 0, -1500]
	};
	var view4 = {
	  cam: [-450, 200, 900],
	  camLookAt: [-900, -200, -100]
	};
	var view5 = {
	  cam: [-400, -400, 400],
	  camLookAt: [-400, -100, 0]
	};
	var view6 = {
	  cam: [-400, -400, 900],
	  camLookAt: [-400, -100, 0]
	};
	var views = exports.views = [view1, view2, view3, view4, view5, view6];

	function viewRunner(view, camera, config) {
	  var cam = view.cam;
	  var camLookAt = view.camLookAt;
	  //modify camera position
	  _updateBaseCamPosition(config, cam[0], cam[1], cam[2]);
	  _updateCameraPosition(camera, cam[0], cam[1], cam[2]);
	  camera.lookAt(new THREE.Vector3(camLookAt[0], camLookAt[1], camLookAt[2]));

	  //turn on/off effects
	}

	function _updateBaseCamPosition(config, x, y, z) {
	  config.baseCamX = x;
	  config.baseCamY = y;
	  config.baseCamZ = z;
	}
	function _updateCameraPosition(camera, x, y, z) {
	  camera.position.x = x;
	  camera.position.y = y;
	  camera.position.z = z;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _audio = __webpack_require__(4);

	var _lineHelpers = __webpack_require__(10);

	var _helpers = __webpack_require__(1);

	var config = {
	  numLines: 360
	};

	var lines = [],
	    ctx = void 0,
	    playing = void 0,
	    baseHue = void 0;

	exports.default = function () {

	  function setup(canvas, mainConfig) {
	    playing = true;
	    baseHue = (0, _helpers.random)(1, 360);
	    document.body.appendChild(canvas);
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    ctx = canvas.getContext('2d');

	    lines = [];
	    for (var i = 0; i < config.numLines; i++) {
	      lines.push(new Line());
	    }

	    requestAnimationFrame(updateFrame);
	  }

	  function updateFrame() {

	    var audioData = (0, _audio.getAudioData)();
	    var volume = audioData.currentVolume;
	    var frequencyData = audioData.frequencyData;

	    lines.forEach(function (line, index) {
	      if (line.lastPosition) {
	        var lineWidth = frequencyData[index] / 30 + 1;
	        var strokestyle = (0, _lineHelpers.getColor)(baseHue + line.variance, line.saturation, line.lightness, volume / 45 + 0.3);
	        line.draw(line.lastPosition, line.currentPosition, lineWidth, strokestyle, ctx);
	      }
	      //set new positions
	      line.lastPosition = (0, _helpers.deepExtend)({}, line.currentPosition); //deep copy current pos
	      line.currentPosition = (0, _lineHelpers.move)(line.currentPosition, line.direction, frequencyData[index] * frequencyData[index] / 10000);
	      //wrap positions if necessary

	      var _wrapAround = (0, _lineHelpers.wrapAround)(line.currentPosition, line.lastPosition);

	      var _wrapAround2 = _slicedToArray(_wrapAround, 2);

	      line.currentPosition = _wrapAround2[0];
	      line.lastPosition = _wrapAround2[1];


	      line.secondsTilChange--;
	      if (line.secondsTilChange <= 0) {
	        line.secondsTilChange = (0, _helpers.random)(3, 6) * 60;
	        line.direction = (0, _lineHelpers.turnLeftOrRight)(line.direction, (0, _helpers.random)(0, 1));
	      }
	      // line.lineWidth += .02;
	    });

	    baseHue += .02;

	    if (playing) {
	      requestAnimationFrame(updateFrame);
	    }
	  }

	  function teardown() {
	    playing = false;
	  }

	  function Line() {
	    var x = Math.ceil(Math.random() * windowWidth);
	    var y = Math.ceil(Math.random() * innerHeight);
	    this.variance = (0, _helpers.random)(-30, 30);
	    this.saturation = (0, _helpers.random)(60, 100);
	    if ((0, _helpers.random)(0, 2) === 0) {
	      this.lightness = (0, _helpers.random)(15, 50);
	    } else {
	      this.lightness = 0;
	    }

	    this.lineWidth = 1;
	    this.direction = (0, _lineHelpers.getRandomDirection)((0, _helpers.random)(0, 3));
	    this.color = (0, _lineHelpers.getColor)(baseHue + this.variance, this.saturation, this.lightness);
	    this.secondsTilChange = (0, _helpers.random)(1, 4) * 60;
	    this.lastPosition = null;
	    this.currentPosition = { x: x, y: y };
	  }

	  Line.prototype.draw = function (last, current, lineWidth, strokeStyle, ctx) {
	    ctx.beginPath();
	    ctx.moveTo(last.x, last.y);
	    ctx.lineTo(current.x, current.y);
	    ctx.lineWidth = lineWidth;
	    ctx.strokeStyle = strokeStyle;
	    ctx.stroke();
	    ctx.closePath();
	  };

	  return {
	    setup: setup,
	    teardown: teardown,
	    label: 'Lines'
	  };
	}();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.move = move;
	exports.getColor = getColor;
	exports.getRandomDirection = getRandomDirection;
	exports.turnLeftOrRight = turnLeftOrRight;
	exports.wrapAround = wrapAround;

	var _helpers = __webpack_require__(1);

	function move(pos, direction, speed) {
	  if (direction == 'up') {
	    return { x: pos.x, y: pos.y - speed };
	  } else if (direction == 'right') {
	    return { x: pos.x + speed, y: pos.y };
	  } else if (direction == 'down') {
	    return { x: pos.x, y: pos.y + speed };
	  } else if (direction == 'left') {
	    return { x: pos.x - speed, y: pos.y };
	  }
	}

	function getColor(h, s, l) {
	  var a = arguments.length <= 3 || arguments[3] === undefined ? '0.5' : arguments[3];

	  return 'hsla(' + h + ',' + s + '%,' + l + '%, ' + a + ')';
	}
	function getRandomDirection(n) {
	  var directions = ['up', 'right', 'down', 'left'];
	  return directions[n];
	}
	function turnLeftOrRight(direction, n) {
	  var directions = ['up', 'right', 'down', 'left'];
	  var direction = directions.indexOf(direction);
	  if (n == 0) {
	    //left
	    direction--;
	  } else {
	    //right
	    direction++;
	  }
	  if (direction == 4) direction = 0;
	  if (direction == -1) direction = 3;
	  return directions[direction];
	}

	function wrapAround(pos, lastPos) {
	  //sends line to other side of screen if goes out of bounds
	  if (pos.x > windowWidth) {
	    pos.x = 0;
	    lastPos.x = 0;
	  }
	  if (pos.x < 0) {
	    pos.x = windowWidth;
	    lastPos.x = windowWidth;
	  }
	  if (pos.y > windowHeight) {
	    pos.y = 0;
	    lastPos.y = 0;
	  }
	  if (pos.y < 0) {
	    pos.y = windowHeight;
	    lastPos.y = windowHeight;
	  }
	  return [pos, lastPos];
	}

/***/ }
/******/ ]);