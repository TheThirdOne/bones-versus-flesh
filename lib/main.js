var skeleton;
var gun;
var blocks = [];
var shells = [];
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});

var playerLayer = new Kinetic.Layer();
var ground = new Kinetic.Layer();
var hud = new Kinetic.Layer();

var shell = new Image();
shell.onload = function(){
   for(var i = 0; i < 6; i++){
     shells[i] = new Kinetic.Image({
      x: i * 24,
      y: 16,
      draggable:true,
      image: shell,
      width: 16,
      height:32,

    });
   }
  start();
};

var blocksheet = new Image();
var block = function(x,y,width,height){
    return new Kinetic.Sprite({
    x: x*64,
    y: y*64,
    image: blocksheet,
    animation: 'idle',
    animations: {idle: [{
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64
                  }]
                },
    frameRate: 1,
    width: width*64,
    height: height*64,
    scaleX: width,
    scaleY: height
  });
};
blocksheet.onload = function(){
  blocks[0] = block(0,8.5,25,.5);
  blocks[1] = block(0,2,25,.5);
  blocks[2] = block(0,2.5,1,6);
  blocks[3] = block(7,7.5,1,1);
  blocks[4] = block(10,5.5,1,3);
  blocks[5] = block(13,2.5,1,4);
  blocks[6] = block(15,4,1,4.5);
  start();
};

var gunsheet = new Image();
gunsheet.onload = function() {
  gun = new Kinetic.Sprite({
    x: 300,
    y: 200,
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
    x: 300,
    y: 200,
    image: skeletonsheet,
    animation: 'idle',
    animations: bodyanimation,
    frameRate: 8,
    index: 0,
    width: 64,
    height: 64
  });
  start();
};
blocksheet.src = 'res/Block.png';
skeletonsheet.src = 'res/Player.png';
gunsheet.src = 'res/Shotgun.png';
shell.src = 'res/Shell.png';

