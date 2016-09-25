import {analyser, audioElement} from '../audio.js';
let particles, frequencyData;

export default (function(){
  let config = {
    particleBaseSize: 3,
    panMultiplier: 1400, //how much mouse affects pan
    height: 128,//128 // number of particles high
    width: 500,
    spacing: 8,
    baseCamX: -600,
    baseCamY: -400,
    baseCamZ: 900,
    coolOffPeriod: 2500,
    bigBeatSensitivity: 3 //lower is more sensitive
  }
  let vars = {
    heightToFFTratio: null,
    sphereFloor: 0,
    sphereRange: 1,
    baseHue: Math.random(),
    column: 0,
    colors: [],
    currentVolume: null,
    lastVolume: 500, //random large number
    cooledOff: true,
  }

  function init() {
    let particleGeom = new THREE.Geometry();
    var material;
    var colors = [];
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
        colors[index] = new THREE.Color(1,1,1);
        var hue = Math.random();
        colors[index].setHSL( hue, 1.0, 0 );
        particleGeom.vertices[index].hue = hue;
      }
    }
    particleGeom.colors = colors;

    // material
    material = new THREE.PointCloudMaterial({
      size: config.particleBaseSize,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: true
    });

    particles = new THREE.PointCloud(particleGeom, material);

    scene.add( particles );
  }

  function updateFrame(analyser) {


    //AUDIO ------------------------------------

    getAudioData(vars, config, analyser);
    var volumeDelta = vars.currentVolume - vars.lastVolume;

    if(volumeDelta > config.bigBeatSensitivity * audioElement.volume){ //detect change in volume
      if(vars.cooledOff == true){
        changeView();
      }
    }

    vars.lastVolume = vars.currentVolume;

    //PARTICLES ------------------------------------
    particles.geometry.verticesNeedUpdate = true;
    particles.geometry.colorsNeedUpdate = true;

    let currentColumn = selectColumn(vars.column);
    vars.column++;
    if(vars.column >= config.width){
      vars.column = 0;
    }

    setWaveSlice(currentColumn);
    iterateParticles(config, vars);
    // stutterCamPosition(config, vars);

    vars.baseHue += 0.0003;
    if(vars.baseHue > 1){
      vars.baseHue = 0
    };
    camera.lookAt(new THREE.Vector3(camera.position.x,-100,0));

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

  function iterateParticles(config, vars){
    // move particles to the left
    for(var i=0; i<particles.geometry.vertices.length; i++) {
      let particle = particles.geometry.vertices[i];
      particle.x -= config.spacing;
      if(particle.x < config.width * config.spacing * -1){
        particle.x = 0 - config.spacing;
      }
      //particle.z = particle.baseZ + vars.currentVolume;
    }
  }

  function setWaveSlice(currentColumn){
    //set z values + colors
    for(var i=0; i < currentColumn.particles.length; i++) {
      let particle = currentColumn.particles[i];
      let index = currentColumn.indices[i];

      //assign each particle to a FFT band
      var fftBand = i%(analyser.fftSize/vars.heightToFFTratio)
      var amplitude = frequencyData[fftBand];
      // var amplitude = amplitude*amplitude / 200;

      particle.z = amplitude;
      particle.baseZ = amplitude;

      //colorize the particle
      vars.colors[index] = new THREE.Color();
      var modifiedHue = vars.baseHue + (frequencyData[fftBand]/600)
      vars.colors[index].setHSL( modifiedHue, 1, amplitude/255 );

    }
    particles.geometry.colors = vars.colors;
  }

  function getAudioData(vars, config){
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    vars.currentVolume = 0;
    for(var i=0; i<frequencyData.length; i++) {
      vars.currentVolume += frequencyData[i];
    }
    vars.currentVolume /= analyser.fftSize;
  }

  function stutterCamPosition(config, vars){
    // camera.position.x = config.baseCamX + vars.currentVolume* 2;
    camera.position.y = config.baseCamY + vars.currentVolume* 3;
  }

  function changeView(){

    var yMultiplier = Math.random() + 0.5;
    var zMultiplier = Math.random()* 0.7 + 0.5;

    //camera.position.y = config.baseCamY * yMultiplier;
    //camera.position.z = config.baseCamZ * zMultiplier;

    TweenLite.to(camera.position, 0.35, {
      z: config.baseCamZ * zMultiplier,
      ease:Power2.easeOut
    });


    //set cool off
    vars.cooledOff = false;
    setTimeout(function(){
      vars.cooledOff = true;
    },config.coolOffPeriod)

    vars.cooledOffSmall = false;
    setTimeout(function(){
      vars.cooledOffSmall = true;
    },config.coolOffPeriodSmall)
  }

  return{
    init,
    updateFrame
  }
}())