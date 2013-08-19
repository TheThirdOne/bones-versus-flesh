var skelaton;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});
var layer = new Kinetic.Layer();
var skelatonSheet = new Image();
skelatonSheet.onload = function() {
  skelaton = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: skelatonSheet,
    animation: 'idle',
    animations: animations,
    frameRate: 7,
    index: 0,
    width: 64
  });

  // add the shape to the layer
  layer.add(skelaton);

  // add the layer to the stage
  stage.add(layer);

  // start sprite animation
  skelaton.start();
  skelatonSheet.src = 'res/player.png';
};