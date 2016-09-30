import {spherize} from './helpers.js';
import {analyser, getAudioData} from '../helpers/audio.js';
import {setup3dScene} from '../helpers/3d.js';

export default (function(){
  let particles,
      changeViewInterval,
      currentVolume,
      frequencyData,
      camera,
      scene,
      renderer,
      particleGeom,
      material,
      playing

  let config = {
    panMultiplier: 300, //how much mouse affects pan
    numberParticles: 15000,
    baseZoom: 200
  }

  let vars ={
    particleBaseSize: 0.7,
    sphereFloor: 0,
    sphereRange: 1,
    baseHue: 0,
    view: 0,
  }

  //the init function called from the main.js
  function setup(canvas, mainConfig) {
    playing = true;
    let threeD = setup3dScene(canvas);
    ({camera, scene} = threeD)
    renderer = new THREE.WebGLRenderer({canvas: canvas}) //dont create multiple renderers
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    particleGeom = new THREE.Geometry()
    window.colors = [];

    //CREATE THE SPHERE
    for (var i = 0; i < config.numberParticles; i++){

      //create particle within half sphere
      var x = -1 + Math.random() * 2;
      var y = -1 + Math.random() * 2;
      var z = Math.abs( -1 + Math.random() * 2 ); //abs = half sphere
      var sphere = spherize(x,y,z);

      particleGeom.vertices.push( new THREE.Vector3() );
      particleGeom.vertices[i].origX = sphere.x
      particleGeom.vertices[i].origY = sphere.y
      particleGeom.vertices[i].origZ = sphere.z

      // vertex colors
      colors[i] = new THREE.Color(1,1,1);
      colors[i].setHSL( Math.random(), 1.0, 0.5 );

    }
    particleGeom.colors = colors;
    // material
    material = new THREE.PointCloudMaterial({
        size: vars.particleBaseSize,
        vertexColors: THREE.VertexColors
    });
    particles = new THREE.PointCloud(particleGeom, material);
    scene.add( particles );

    changeViewInterval = setInterval(function(){
      changeView();
    },1500)
    requestAnimationFrame(updateFrame);


  }

  function teardown() {
    clearInterval(changeViewInterval)
    playing = false
    scene.remove(particles)
    particleGeom.dispose()
    material.dispose()
  }


  function updateFrame() {
    renderer.render( scene, camera ); // and render the scene from the perspective of the camera
    calcFPS();

    //AUDIO ------------------------------------

    let audioData = getAudioData();
    ({currentVolume, frequencyData} = audioData)

    //PARTICLES ------------------------------------

    particles.geometry.verticesNeedUpdate = true;
    particles.geometry.colorsNeedUpdate = true;
    var colors = []; //create the array that will house all the colors of each particle
    let geometry = particles.geometry;
    let fftSize = analyser.fftSize;

    // iterate through every particle
    for(var i=0; i<particles.geometry.vertices.length; i++) {
      let particle = particles.geometry.vertices[i];

      //assign each particle to a FFT band
      var fftBand = i%(fftSize/2)
      var amplitude = frequencyData[fftBand];

      //make particles with 0 amplitude bounce to averagevolume
      if (amplitude == 0) amplitude = currentVolume;

      particle.x = particle.origX * amplitude * vars.sphereRange + particle.origX*vars.sphereFloor;
      particle.y = particle.origY * amplitude * vars.sphereRange + particle.origY*vars.sphereFloor;
      particle.z = particle.origZ * amplitude * vars.sphereRange + particle.origZ*vars.sphereFloor;


      //colorize the particle
      colors[i] = new THREE.Color();
      var modifiedHue = vars.baseHue + (frequencyData[fftBand]/250)
      colors[i].setHSL( modifiedHue, 1, .6 );

      //if no volume, blacken all particles.
      if (currentVolume == 0){
        colors[i].setHSL(0,0,0);
      }

    }
    vars.baseHue += + 0.005;
    if (vars.baseHue > 1) vars.baseHue = 0;
    geometry.colors = colors;

    //move cam up down out on mouseY
    // var cameraOffset = mouseY/windowHeight - 0.5;
    // camera.position.y = cameraOffset * config.panMultiplier;

    //rotate cam left right on mouseX
    // var cameraOffset = mouseX/windowWidth - 0.5;
    // camera.position.x = cameraOffset * config.panMultiplier * -1;
    camera.lookAt(new THREE.Vector3(0,0,0));

    if(playing){
      requestAnimationFrame(updateFrame);
    }
  }


  function changeView(){

    if(vars.view == 0){
      vars.sphereFloor = 100;
      vars.sphereRange = 0.6;
      setTimeout(function(){
        config.baseZoom = 300;
      },700)
    }
    if(vars.view == 1){
      config.baseZoom = 175;
      setTimeout(function(){
        particles.material.size = vars.particleBaseSize * 2;
      },700)
      setTimeout(function(){
        particles.material.size = vars.particleBaseSize = 0.7;
      },1200)
    }
    if(vars.view == 2){
      vars.sphereFloor = 0;
      vars.sphereRange = 1;
      setTimeout(function(){
        config.baseZoom = 100;
      },700)
      setTimeout(function(){
        config.baseZoom = 300;
        vars.sphereFloor=120;
      vars.sphereRange=.05;
      },1200)
    }
    if(vars.view == 3){
      vars.sphereFloor = 50;
      vars.sphereRange = 1;
      config.baseZoom = 200;
      setTimeout(function(){
        vars.sphereFloor = 80;
        config.baseZoom = 500;
      },300)
      setTimeout(function(){
        config.baseZoom = 500;
      },700)
      setTimeout(function(){
        config.baseZoom = 200;
      },1200)
    }
    if(vars.view == 4){
      vars.sphereFloor=120;
      vars.sphereRange=.05;
      setTimeout(function(){
        config.baseZoom = 160;
      },1300)
    }
    vars.view++;
    if(vars.view > 4){
      vars.view = 0;
    }
  }

  return { setup, teardown, label: 'Starburst' }
}())
