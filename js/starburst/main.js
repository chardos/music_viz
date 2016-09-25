import {spherize} from './helpers.js';
import {analyser, getFreqData} from '../audio.js';

export default (function(){
  let particles;

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
    particleGeom: null
  }

  function reset() {
    vars.particleGeom.dispose();
  }

  //the init function called from the main.js
  function init() {

    vars.particleGeom = new THREE.Geometry()
    var particleGeom = vars.particleGeom;
    var material;
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

    let changeViewInt = setInterval(function(){
      changeView();
    },1500)

  }


  function updateFrame() {

    //AUDIO ------------------------------------

    //get audio data

    let frequencyData = getFreqData(analyser);
    //get average
    var averageVolume = 0;
    for(var i=0; i<frequencyData.length/5; i++) { //divide by 4 = just the bass
      averageVolume += frequencyData[i];
    }
    averageVolume /= 500;


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
      if (amplitude == 0) amplitude = averageVolume;

      particle.x = particle.origX * amplitude * vars.sphereRange + particle.origX*vars.sphereFloor;
      particle.y = particle.origY * amplitude * vars.sphereRange + particle.origY*vars.sphereFloor;
      particle.z = particle.origZ * amplitude * vars.sphereRange + particle.origZ*vars.sphereFloor;


      //colorize the particle
      colors[i] = new THREE.Color();
      var modifiedHue = vars.baseHue + (frequencyData[fftBand]/250)
      colors[i].setHSL( modifiedHue, 1, .6 );

      //if no volume, blacken all particles.
      if (averageVolume == 0){
        colors[i].setHSL(0,0,0);
      }

    }
    vars.baseHue += + 0.005;
    if (vars.baseHue > 1) vars.baseHue = 0;
    geometry.colors = colors;

    //move cam up down out on mouseY
    var cameraOffset = mouseY/windowHeight - 0.5;
    camera.position.y = cameraOffset * config.panMultiplier;

    //rotate cam left right on mouseX
    var cameraOffset = mouseX/windowWidth - 0.5;
    camera.position.x = cameraOffset * config.panMultiplier * -1;
    camera.lookAt(new THREE.Vector3(0,0,0));

  }


  function changeView(){

    if(vars.view == 0){
      console.log(0);
      vars.sphereFloor = 100;
      vars.sphereRange = 0.6;
      setTimeout(function(){
        config.baseZoom = 300;
      },700)
    }
    if(vars.view == 1){
      console.log(1);
      config.baseZoom = 175;
      setTimeout(function(){
        particles.material.size = vars.particleBaseSize * 2;
      },700)
      setTimeout(function(){
        particles.material.size = vars.particleBaseSize = 0.7;
      },1200)
    }
    if(vars.view == 2){
      console.log(2);
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
      console.log(3);
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
      console.log(4);
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
  return{
    init,
    updateFrame
  }
}())
