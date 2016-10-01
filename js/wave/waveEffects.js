import {random} from '../helpers.js';

function stutterCamX(config, camera, particles, currentVolume){
  camera.position.x = config.baseCamX + currentVolume * 3;
}

function pulseAmplitude(config, camera, particles, currentVolume){
  particles.geometry.vertices.forEach(function(particle){
    particle.z = (particle.baseZ * currentVolume/50) - 100
  })
}

function fuzzy(config, camera, particles, currentVolume){
  particles.geometry.vertices.forEach(function(particle){
    let rand = random(-10,10);
    particle.z = particle.baseZ + rand;
  })
}

let effects = [stutterCamX, pulseAmplitude, fuzzy];
export default effects;
