var c = document.getElementById("c");
var ctx = c.getContext("2d");

var replays = [[]];
var state = new_state();
load_level(state)

c.onmousemove = function (e) {
    let rect = c.getBoundingClientRect();
    state.mouse.x = e.layerX - rect.left;
    state.mouse.y = e.layerY - rect.top;
}
c.onmousedown = function (e) {
    changed = true; 
    state.mouse.down = true;
}
c.onmouseup= function (e) {
    changed = true;
    state.mouse.down = false;
}

let changed = true;
var jump = 32, down = 83, left = 65, right = 68, up=87, reload=82;
state.keys[left] = state.keys[right] = state.keys[reload] = state.keys[jump] = false;
document.onkeydown = function(evt){
  changed = true;
  if(!state.keys[evt.keyCode] ){
    state.keys[evt.keyCode] = true;
  }
};
document.onkeyup = function(evt){
  changed = true;
  state.keys[evt.keyCode] = false;
};

let frame = 0;
function loop(){
    let delta = performance.now() - state.last;
    delta = Math.min(delta,500);
    frame += 1;
    if (frame == 100) {
        console.log("Delta",delta);
        frame = 0;
    }
    if (delta < 50) {
       // requestAnimationFrame(loop);
       // return;
    }
    state.last = performance.now();
    if (changed) {
        changed = false;
        let keys = state.keys;
        replays[0].push([delta,state.mouse.x|0,state.mouse.y|0,state.player.x,state.player.y,keys[left],keys[right],keys[jump],keys[reload],state.mouse.down])
    } else {
        replays[0].push([delta,state.mouse.x|0, state.mouse.y|0]);
    }
    let actions = update(delta,state);
    update_animation(delta,state, actions);
    render(state);
    requestAnimationFrame(loop);
}

state.last = performance.now();
loop();



var sounds = {};
init_sound('shotgun',5, .25);
init_sound('reload',5 , .5);

function init_sound(type, channels, volume){
	sounds[type]=[];
	for (a=0;a<channels;a++) {
		sounds[type][a] = {};
		sounds[type][a].channel = new Audio();
		sounds[type][a].channel.src = document.getElementById(type).src;
		sounds[type][a].channel.load();
		sounds[type][a].finished = -1;
		if(volume)
			sounds[type][a].channel.volume = volume;
	}
}

function play_multi_sound(s, start) {
	for (a=0;a<sounds[s].length;a++) {
		thistime = new Date();
		temp = sounds[s];
		if (sounds[s][a].finished < thistime.getTime()) {			// is this channel finished?
			sounds[s][a].finished = thistime.getTime() + document.getElementById(s).duration*1000 + start*1000;
			sounds[s][a].channel.currentTime = start;
			sounds[s][a].channel.play();
			break;
		}
	}
}

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    state = new_state();
    load_level(state)
    state.last = performance.now();
  }
});

window.onbeforeunload = function () {
    localStorage.replays = replays.map(r => r.map(s => s.join(',')).join(":")).join('\n');
  //  localStorage.replays = replays.map(r => r.xs.join() + ':' + r.ys.join()).join('\n');
}
