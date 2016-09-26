export function setup3dScene(canvas) {
  // field of view, aspect ratio for render output, near and far clipping plane.
  camera = new THREE.PerspectiveCamera(80, windowWidth / window.innerHeight, 1, 4000 );
  camera.position.z = 200;

  // the scene contains all the 3D object data
  scene = new THREE.Scene();

  // camera needs to go in the scene
  scene.add(camera);

  // and the CanvasRenderer figures out what the
  // stuff in the scene looks like and draws it!
  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}
