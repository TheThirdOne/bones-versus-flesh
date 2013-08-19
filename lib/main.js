var skeleton;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});
var layer = new Kinetic.Layer();
var skeletonsheet = new Image();
skeletonsheet.onload = function() {
  skeleton = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: skeletonsheet,
    animation: 'idle',
    animations: animations,
    frameRate: 7,
    index: 0,
    width: 64
  });

  // add the shape to the layer
  layer.add(skeleton);

  // add the layer to the stage
  stage.add(layer);

  // start sprite animation
  skeleton.start();
};
skeletonsheet.src = 'res/Player.png';
window.setInterval(loop,30);
