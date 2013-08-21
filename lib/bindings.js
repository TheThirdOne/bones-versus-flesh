var keys = [];
var bindingsDown = [], bindingsUp = [];
var up = 32, down = 83, left = 65, right = 68;
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


bindingsDown[up] = function(){
  if(onGround()){
    console.log('jump');
    skeleton.setAnimation('jump');
    velocityY -= 10;
    jumped = true;
    player.setY(skeleton.getY()-20);
    skeleton.afterFrame(2, function() {
      skeleton.setAnimation('jump_stay');
    });
  }
};
bindingsDown[right] = function(){
  player.setDirection(1);
  if(onGround()){
    skeleton.setAnimation('run');
    goingRight = true;
    goingLeft = false;
  }
};
bindingsUp[right] = function(){
  if(onGround() && goingRight){
    skeleton.setAnimation('idle');
    velocityX = 0;
    goingRight = false;
  }
}
bindingsDown[left] = function(){
  player.setDirection(-1);
  if(onGround()){
    skeleton.setAnimation('run');
    goingLeft = true;
    goingRight = false;
  }
};
bindingsUp[left] = function(){
  if(onGround() && goingLeft){
    skeleton.setAnimation('idle');
    velocityX = 0;
    goingLeft = false;
  }
}
bindingsDown[82] = function(){
  player.reload();
};
bindingsDown[13] = function(){
  if(player.canFire()){
    player.fire();
  }
};
bindingsDown[down]=function(){
  gun.setRotationDeg(90*((gun.getScaleX() > 0)?1:-1));
  down = true;
  player.setX(skeleton.getX());
}
bindingsUp[down]=function(){
  gun.setRotationDeg(0);
  down = false;
  player.setX(skeleton.getX());
}
