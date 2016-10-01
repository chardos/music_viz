let view1 = {
  cam:[-700, 0, 500],
  camLookAt:[-700,0,500]
}
let view2 = {
  cam:[-600, -400, 700],
  camLookAt:[-600,-100,0]
}
let view3 = {
  cam:[-2000, 0, 400],
  camLookAt:[0,0,-1500]
}
let view4 = {
  cam:[-450, 200, 900],
  camLookAt:[-900,-200,-100]
}
let view5 = {
  cam:[-400, -400, 400],
  camLookAt:[-400,-100,0]
}
let view6 = {
  cam:[-400, -400, 900],
  camLookAt:[-400,-100,0]
}
export const views = [
  view1,
  view2,
  view3,
  view4,
  view5,
  view6
];

export function viewRunner(view, camera, config){
  let cam = view.cam
  let camLookAt = view.camLookAt
  //modify camera position
  _updateBaseCamPosition(config, cam[0], cam[1], cam[2])
  _updateCameraPosition(camera, cam[0], cam[1], cam[2])
  camera.lookAt(new THREE.Vector3(camLookAt[0], camLookAt[1], camLookAt[2]));

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
