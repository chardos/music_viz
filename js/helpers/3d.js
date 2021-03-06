export function setup3dScene() {
  // field of view, aspect ratio for render output, near and far clipping plane.
  let camera = new THREE.PerspectiveCamera(80, windowWidth / window.innerHeight, 1, 4000 )
  camera.position.z = 200

  // the scene contains all the 3D object data
  let scene = new THREE.Scene()
  scene.add(camera)

  return {camera, scene}
}
