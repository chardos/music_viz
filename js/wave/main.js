import effects from './waveEffects.js';
import {analyser, audioElement, getAudioData} from '../helpers/audio.js';
import {views, viewRunner} from './waveViews.js';
import {setup3dScene} from '../helpers/3d.js';
import {random} from '../helpers.js';

let particles,
    particleGeom,
    frequencyData,
    currentVolume,
    camera,
    scene,
    renderer,
    material,
    colors,
    columnNum,
    currentEffect,
    changeViewInt,
    playing;

export default (function(){
  let config = {
    particleBaseSize: 3,
    panMultiplier: 1400, //how much mouse affects pan
    height: 128,//128 // number of particles high
    width: 500,
    spacing: 8,
    baseCamX: -600,
    baseCamY: -400,
    baseCamZ: 700,
    coolOffPeriod: 2500,
    bigBeatSensitivity: 3 //lower is more sensitive
  }
  let vars = {
    heightToFFTratio: null,
    baseHue: Math.random(),
    lastVolume: 500, //random large number
    cooledOff: true,
  }

  function setup(canvas, mainConfig) {
    columnNum = 0;
    playing = true;
    let threeD = setup3dScene(canvas);
    ({camera, scene} = threeD)
    window.p = camera.position;
    window.c = camera;
    window.config = config;
    renderer = new THREE.WebGLRenderer({canvas: canvas}) //dont create multiple renderers
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )
    particleGeom = new THREE.Geometry();
    colors = [];
    camera.position.x = config.baseCamX;
    camera.position.y = config.baseCamY;
    camera.position.z = config.baseCamZ;
    let fftSize = analyser.fftSize;

    //set ratio
    vars.heightToFFTratio = fftSize / config.height;

    //CREATE THE PARTICLE GRID
    for (var i = 0; i < config.width; i++){
      for (var i2 = 0; i2 < config.height; i2++){
        //create sheet of particles
        var x = i * config.spacing;
        var y = i2 * config.spacing;
        var z = 0;

        particleGeom.vertices.push( new THREE.Vector3() );
        var index = i*config.height + i2;
        particleGeom.vertices[index].x = x;
        particleGeom.vertices[index].y = y - (config.height * config.spacing/2);
        particleGeom.vertices[index].z = z;
        particleGeom.vertices[index].baseZ = z;

        // vertex colors
        colors[index] = new THREE.Color();
        var hue = Math.random();
        colors[index].setHSL( hue, 1.0, 0 ); //Set lightness to darken particles
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
    scene.add( particles );
    console.log(particles);

    changeView();
    changeViewInt = setInterval(changeView, 2000)

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
    renderer.render( scene, camera ); // and render the scene from the perspective of the camera

    //AUDIO ------------------------------------
    let audioData = getAudioData();
    ({currentVolume, frequencyData} = audioData)

    //BIG BEAT DETECTION------------------------
    vars.lastVolume = currentVolume;

    //PARTICLES ------------------------------------
    particles.geometry.verticesNeedUpdate = true;
    particles.geometry.colorsNeedUpdate = true;

    let currentColumn = selectColumn(columnNum);
    columnNum++;
    if(columnNum >= config.width){
      columnNum = 0;
    }

    stylizeColumn(currentColumn);
    shiftParticlesLeft(config, vars);
    if(currentEffect){
      currentEffect(config, camera, particles, currentVolume)
    }

    vars.baseHue += 0.0003;
    if(vars.baseHue > 1){
      vars.baseHue = 0
    };

    // camera.lookAt(new THREE.Vector3(-500,0,0));
    // camera.lookAt(new THREE.Vector3(camera.position.x,-100,0));

    if(playing){
      requestAnimationFrame(updateFrame);
    }
  }


  function selectColumn(index) {
    var column = {};
    let height = config.height;
    column.particles = [];
    column.indices = [];
    var startI = height*index;
    var endI = height*index + height
    for(var i=startI; i<endI; i++) {
      column.particles.push(particles.geometry.vertices[i]);
      column.indices.push(i);
    }
    return column;
  }

  function shiftParticlesLeft(config, vars){
    // move particles to the left
    for(var i=0; i<particles.geometry.vertices.length; i++) {
      let particle = particles.geometry.vertices[i];
      particle.x -= config.spacing;
      if(particle.x < config.width * config.spacing * -1){
        particle.x = 0 - config.spacing;
      }
    }
  }

  function stylizeColumn(currentColumn){
    //set z values + colors
    for(var i=0; i < currentColumn.particles.length; i++) {
      let particle = currentColumn.particles[i];
      let index = currentColumn.indices[i];

      //assign each particle to a FFT band
      var fftBand = i%(analyser.fftSize/vars.heightToFFTratio)
      var amplitude = frequencyData[fftBand];
      var lightness = amplitude/255
      // amplitude = (amplitude * amplitude * amplitude) / 90000

      particle.z = amplitude;
      particle.baseZ = amplitude;

      //colorize the particle
      colors[index] = new THREE.Color();
      var modifiedHue = vars.baseHue + (frequencyData[fftBand]/600)
      colors[index].setHSL( modifiedHue, 1, lightness );

    }
  }

  function changeView(){
    loadNewView()
    loadNewEffect()
  }
  function loadNewView(){
    let rand = random(0, views.length - 1)
    viewRunner(views[rand], camera, config)
  }
  function loadNewEffect(){
    // currentEffect = effects[3]
    let rand = random(0, 1)
    if(rand){
      currentEffect = false
    }
    else{
      let rand = random(0, effects.length - 1)
      currentEffect = effects[rand]
    }
  }

  return{
    setup,
    teardown,
    renderer,
    label: 'Wave'
  }
}())

//inspiration from: https://3bits.net/
