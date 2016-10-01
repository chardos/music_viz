export const views = [
  viewOne,
  viewTwo
];

export function viewOne(camera, config){
  let x = -700
  let y = 0
  let z = 500

  //modify camera position
  _updateBaseCamPosition(config, x,y,z)
  _updateCameraPosition(camera, x,y,z)
  camera.lookAt(new THREE.Vector3(x,0,z));

  //turn on/off effects
}
export function viewTwo(camera, config){
  let x = -600
  let y = -400
  let z = 700

  //modify camera position
  _updateBaseCamPosition(config, x,y,z)
  _updateCameraPosition(camera, x,y,z)
  camera.lookAt(new THREE.Vector3(x,-100,0));

  //turn on/off effects
}


function _updateBaseCamPosition(config, x, y, z){
  config.baseCamX = x;
  config.baseCamY = y;
  config.baseCamZ = z;
}
function _updateCameraPosition(camera, x, y, z){
  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;
}
