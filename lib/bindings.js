var keys = [];
var bindingsDown = [], bindingsUp = [];
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


bindingsDown[87] = function(){
  if(onGround()){
    skeleton.setAnimation('jump');
    velocity -= 10;
    jumped = true;
    skeleton.setY(skeleton.getY()-20);
    skeleton.afterFrame(2, function() {
      skeleton.setAnimation('jump_stay');
    });
  }
};
bindingsDown[68] = function(){
  if(onGround()){
    skeleton.setAnimation('run');
    if(skeleton.getScaleX() < 0){
      skeleton.setScaleX(1);
      skeleton.setX(skeleton.getX()-skeleton.getWidth()/2);
    }
    goingRight = true;
    goingLeft = false;
  }
};
bindingsUp[68] = function(){
  if(onGround() && goingRight){
    skeleton.setAnimation('idle');
    goingRight = false;
  }
}
bindingsDown[65] = function(){
  if(onGround()){
    skeleton.setAnimation('run');
    if(skeleton.getScaleX() > 0){
      console.log('1');
      skeleton.setScaleX(-1);
      skeleton.setX(skeleton.getX()+skeleton.getWidth()/2);
    }
    goingLeft = true;
    goingRight = false;
  }
};
bindingsUp[65] = function(){
  if(onGround() && goingLeft){
    skeleton.setAnimation('idle');
    goingLeft = false;
  }
}