var skeleton;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});
var player = new Kinetic.Layer();
var ground = new Kinetic.Layer();
var blocksheet = new Image();
blocksheet.onload = function(){
  console.log("block");
  var block = new Kinetic.Image({
  	x: 0,
    y:114,
    image: blocksheet,
    width: 500,
    height:500
  });
  console.log("block");
  ground.add(block);
  stage.add(ground);
}
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
  player.add(skeleton);

  // add the layer to the stage
  stage.add(player);

  // start sprite animation
  skeleton.start();
};
blocksheet.src = 'res/Block.png';
skeletonsheet.src = 'res/Player.png';
window.setInterval(loop,30);
