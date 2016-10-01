

function stutterCamX(config, camera, particles, currentVolume){
  camera.position.x = config.baseCamX + currentVolume * 2;
}

function pulseAmplitude(config, camera, particles, currentVolume){
  // console.log(particles.geometry.vertices[0]);
  particles.geometry.vertices.forEach(function(particle){
    particle.z = (particle.baseZ * currentVolume/50) - 100
  })
}


let effects = [stutterCamX, pulseAmplitude];
export default effects;
