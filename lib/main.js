var skeleton;
var gun;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});
var playerLayer = new Kinetic.Layer();
var ground = new Kinetic.Layer();
var blocksheet = new Image();
blocksheet.onload = function(){
  var block = new Kinetic.Image({
  	x: 0,
    y:114,
    image: blocksheet,
    width: 500,
    height:500
  });
  ground.add(block);
  stage.add(ground);
}
var gunsheet = new Image();
gunsheet.onload = function() {
  gun = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: gunsheet,
    animation: 'idle',
    animations: shotgunanimation,
    frameRate: 12,
    index: 0,
    width: 64,
    scale: .75
  });

  // add the shape to the layer
  playerLayer.add(gun);

  // start sprite animation
  gun.start();
};
var skeletonsheet = new Image();
skeletonsheet.onload = function() {
  skeleton = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: skeletonsheet,
    animation: 'idle',
    animations: bodyanimation,
    frameRate: 8,
    index: 0,
    width: 64
  });

  // add the shape to the layer
  playerLayer.add(skeleton);

  // add the layer to the stage
  stage.add(playerLayer);
  startPlayer();
  // start sprite animation
  skeleton.start();
};
//blocksheet.src = 'res/Block.png';
skeletonsheet.src = 'res/Player.png';
gunsheet.src = 'res/Shotgun.png';
window.setInterval(loop,30);
