var body = {
  anims:[{name: 'idle', slides:[7]},
         {name: 'run', slides:[0,1,2,3]},
         {name: 'jump', slides:[4,5,6]},
         {name: 'jump_stay', slides:[6]}],
         columns:4,rows:2,width:32,height:64};
var shotgun = {
  anims:[
        {name: 'idle', slides: [0]},
        {name: 'fire', slides: [0,1,2,3,0]},
        {name: 'walk', slides: [4,4,5,5,6,6,5,5]},
        {name: 'reload', slides: [8,9,10,11,12,13,14,15]}],
        columns:4,rows:4,width:64,height:32};

var bodyanimation = AnimationSet(body);
var shotgunanimation = AnimationSet(shotgun);

function AnimationSet(data){
  var out = {};
  for(var i = 0; i < data.anims.length; i++){
    out[data.anims[i].name]=Animation(data.anims[i].slides,data);
  }
  return out;
}
function Animation(slides, data){
  var x,y;
  var out=[];
  for(var i = 0; i < slides.length; i++){
    x = slides[i]%data.columns;
    y = Math.floor(slides[i]/data.columns);
    out[i] = {'x': x*data.width, 'y' : y*data.height,
           'width': data.width, 'height': data.height};
  }
  return out;
}