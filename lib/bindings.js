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
  skeleton.setAnimation('jump');

  skeleton.afterFrame(2, function() {
    skeleton.setAnimation('idle');
  });
};
bindingsDown[68] = function(){
  skeleton.setAnimation('run');
  if(skeleton.getScaleX() < 0){
    skeleton.setScaleX(1);
    skeleton.setX(skeleton.getX()-skeleton.getWidth()/2);
  }
};
bindingsUp[68] = function(){
  skeleton.setAnimation('idle');
}
bindingsDown[65] = function(){
  skeleton.setAnimation('run');
  if(skeleton.getScaleX() > 0){
    console.log('1');
    skeleton.setScaleX(-1);
    skeleton.setX(skeleton.getX()+skeleton.getWidth()/2);
  }
};
bindingsUp[65] = function(){
  skeleton.setAnimation('idle');
}