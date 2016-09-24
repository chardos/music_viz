
//TODO: alternate between the 2 (wave and sphere)
//TODO: add microphone


var V = V || {};

V.wave = {};

V.wave.config = {
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

V.wave.vars={
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

V.wave.makeParticles = function() { 

  var wCfg = V.wave.config;
  var wVars = V.wave.vars;
  particleGeom = new THREE.Geometry();
  var material; 
  var colors = [];
  camera.position.x = wCfg.baseCamX;
  camera.position.y = wCfg.baseCamY;
  camera.position.z = wCfg.baseCamZ;

  //set ratio
  wVars.heightToFFTratio = V.config.fftSize / V.wave.config.height;

  //CREATE THE PARTICLE GRID
  for (var i = 0; i < wCfg.width; i++){
    for (var i2 = 0; i2 < wCfg.height; i2++){
      //create sheet of particles
      var x = i * wCfg.spacing;
      var y = i2 * wCfg.spacing;
      var z = 0; 

      particleGeom.vertices.push( new THREE.Vector3() );
      var index = i*wCfg.height + i2;
      particleGeom.vertices[index].x = x;
      particleGeom.vertices[index].y = y - (wCfg.height * wCfg.spacing/2);
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
    size: wCfg.particleBaseSize,
    vertexColors: THREE.VertexColors,
    sizeAttenuation: true
  });

  particles = new THREE.PointCloud(particleGeom, material);
  
  scene.add( particles );
}


V.wave.reset = function() { 

}
V.wave.updateFrame = function() { 

  var cfg = V.config;
  var wCfg = V.wave.config;
  var wVars = V.wave.vars;

  //AUDIO ------------------------------------

  V.wave.getAudioData(wVars, wCfg);
  var volumeDelta = wVars.currentVolume - wVars.lastVolume;

  if(volumeDelta > wCfg.bigBeatSensitivity * audioElement.volume){ //detect change in volume
    if(wVars.cooledOff == true){
      V.wave.changeView();
    }
  }

  wVars.lastVolume = wVars.currentVolume; 

  //PARTICLES ------------------------------------
  particles.geometry.verticesNeedUpdate = true;
  particles.geometry.colorsNeedUpdate = true;

  currentColumn = V.wave.selectColumn(wVars.column);
  wVars.column++;
  if(wVars.column >= wCfg.width){
    wVars.column = 0;
  }

  V.wave.setWaveSlice(cfg, wVars);
  V.wave.iterateParticles(wCfg, wVars);
  V.wave.stutterCamPosition(wCfg, wVars);

  wVars.baseHue += 0.0003;
  if(wVars.baseHue > 1){ 
    wVars.baseHue = 0 
  };
  camera.lookAt(new THREE.Vector3(camera.position.x,-100,0));

}


V.wave.selectColumn = function(index) { 
  var column = {};
  column.particles = [];
  column.indices = [];
  var startI = this.config.height*index;
  var endI = this.config.height*index + this.config.height
  for(var i=startI; i<endI; i++) {
    column.particles.push(particles.geometry.vertices[i]); 
    column.indices.push(i); 
  }
  return column;
}

V.wave.iterateParticles = function(wCfg, wVars){
  // move particles to the left
  for(var i=0; i<particles.geometry.vertices.length; i++) {
    particle = particles.geometry.vertices[i]; 
    particle.x -= wCfg.spacing;
    if(particle.x < wCfg.width * wCfg.spacing * -1){
      particle.x = 0 - wCfg.spacing;
    }
    //particle.z = particle.baseZ + wVars.currentVolume;
  }

}

V.wave.setWaveSlice = function(cfg, wVars){
  //set z values + colors
  for(var i=0; i < currentColumn.particles.length; i++) {
    particle = currentColumn.particles[i]; 
    index = currentColumn.indices[i]; 

    //assign each particle to a FFT band
    var fftBand = i%(cfg.fftSize/wVars.heightToFFTratio)
    var amplitude = frequencyData[fftBand];

    particle.z = amplitude;
    particle.baseZ = amplitude;

    //colorize the particle
    wVars.colors[index] = new THREE.Color();
    var modifiedHue = wVars.baseHue + (frequencyData[fftBand]/600)
    wVars.colors[index].setHSL( modifiedHue, 1, amplitude/255 );

  }
  particles.geometry.colors = wVars.colors;
}

V.wave.getAudioData = function(wVars, wCfg){
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);

  wVars.currentVolume = 0;
  for(var i=0; i<frequencyData.length; i++) { 
    wVars.currentVolume += frequencyData[i];
  }
  wVars.currentVolume /= V.config.fftSize;
}

V.wave.stutterCamPosition = function(wCfg, wVars){
  camera.position.x = wCfg.baseCamX + wVars.currentVolume* 2;
  //camera.position.y = wCfg.baseCamY + wVars.currentVolume* 3;
}

V.wave.changeView = function(){
  var wCfg = V.wave.config;
  var wVars = V.wave.vars;

  var yMultiplier = Math.random() + 0.5;
  var zMultiplier = Math.random()* 0.7 + 0.5;

  //camera.position.y = wCfg.baseCamY * yMultiplier;
  //camera.position.z = wCfg.baseCamZ * zMultiplier;

  TweenLite.to(camera.position, 0.35, {
    z: wCfg.baseCamZ * zMultiplier,
    ease:Power2.easeOut
  });


  //set cool off
  wVars.cooledOff = false;
  setTimeout(function(){
    wVars.cooledOff = true;
  },wCfg.coolOffPeriod)

  wVars.cooledOffSmall = false;
  setTimeout(function(){
    wVars.cooledOffSmall = true;
  },wCfg.coolOffPeriodSmall)
}


