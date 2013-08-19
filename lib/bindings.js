var keys = [];
var bindingsDown = [], bindingsUp = [];
bindingsDown[87] = function(){
  skelaton.setAnimation('jump');

  skelaton.afterFrame(2, function() {
    skelaton.setAnimation('idle');
  });
};
bindingsDown[68] = function(){
  skelaton.setAnimation('run');
  if(skelaton.getScaleX() < 0){
    skelaton.setScaleX(1);
    skelaton.setX(skelaton.getX()-skelaton.getWidth()/2);
  }
};
bindingsUp[68] = function(){
  skelaton.setAnimation('idle');
}
bindingsDown[65] = function(){
  skelaton.setAnimation('run');
  if(skelaton.getScaleX() > 0){
    skelaton.setScaleX(-1);
    skelaton.setX(skelaton.getX()+skelaton.getWidth()/2);
  }
};
bindingsUp[65] = function(){
  skelaton.setAnimation('idle');
}