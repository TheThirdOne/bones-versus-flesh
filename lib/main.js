var skelaton;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 200
});
var layer = new Kinetic.Layer();
var skeletonSheet = new Image();
skeletonSheet.onload = function() {
  skelaton = new Kinetic.Sprite({
    x: 250,
    y: 40,
    image: skeletonSheet,
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
<<<<<<< Updated upstream
  skeletonSheet.src = 'res/player.png';
};
=======
  skelatonSheet.src = 'res/player.png';
};
document.onkeydown = function(evt){
  if(!keys[evt.keyCode] ){
    keys[evt.keyCode] = true;
    console.log(evt.keyCode);
    if(bindingsDown[evt.keyCode])
      bindingsDown[evt.keyCode]();
  }
}
document.onkeyup = function(evt){
  keys[evt.keyCode] = false;
  if(bindingsUp[evt.keyCode])
      bindingsUp[evt.keyCode]();
};
>>>>>>> Stashed changes
