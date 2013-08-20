var skeleton;
var gun;
var block;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});

var playerLayer = new Kinetic.Layer();
var ground = new Kinetic.Layer();

var blocksheet = new Image();

blocksheet.onload = function(){
   block = new Kinetic.Sprite({
    x: 0,
    y:364,
    image: blocksheet,
    animation: 'idle',
    animations: {idle: [{
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64
                  }]
                },
    frameRate: 12,
    scaleX: 10,
    scaleY: 1.5
  });
  start();
}

var gunsheet = new Image();
gunsheet.onload = function() {
  gun = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: gunsheet,
    animation: 'idle',
    animations:shotgunanimation,
    frameRate: 12,
    index: 0,
    width: 64,
    scale: .75
  });
  start();
};
var skeletonsheet = new Image();
skeletonsheet.onload = function() {
  skeleton = new Kinetic.Sprite({
    x: 400,
    y: 50,
    image: skeletonsheet,
    animation: 'idle',
    animations: bodyanimation,
    frameRate: 8,
    index: 0,
    width: 64
  });
  start();
};
blocksheet.src = 'res/Block.png';
skeletonsheet.src = 'res/Player.png';
gunsheet.src = 'res/Shotgun.png';

