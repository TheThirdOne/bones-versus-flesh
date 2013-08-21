function onGround(){
	return skeleton.getY() > 300;
}
function collide(){

}
function redrawShots(){
	for (var i = 0; i < shells.length; i++) {
		shells[i].setVisible(i < player.shots);
	};
	hud.draw();
}
function land(){
	velocityX = 0;
	velocityY = 0;
	if(keys[left]||keys[right]){
		if(keys[left]){
			bindingsDown[left]();
			return;
		}
		if(keys[right]){
			bindingsDown[right]();
			return;
		}
	}
	skeleton.setAnimation('idle');
	goingRight = false;
	goingLeft = false;
}
var goingLeft = false, goingRight = false, jumped = false, reloading = false, down = false, firing = false;
var velocityY = 0, velocityX = 0;
var countdown = 4; //used for loading stuff

function loop(){
	if(!onGround()){
		velocityY += .9;
		if(skeleton.getAnimation() == 'run' ){
			skeleton.setAnimation('jump_stay')
		}
		jumped=true;
		
	}else{
		if(goingRight){
			velocityX = 5;
		}else if(goingLeft){
			velocityX = -5;
		}else{
			velocityX = 0;
		}
		if(jumped){
			land();
			jumped = false;
		}
		velocityY = 0;
	}
	player.setY(skeleton.getY()+velocityY);
	player.setX(skeleton.getX()+velocityX);
}
var player;
function start(){
	countdown--;
	console.log('test');
	if(countdown <= 0){
		console.log(block);
		ground.add(block);
		
		block.start();
		// add the shape to the layer
		stage.add(ground);
		playerLayer.add(skeleton);
		playerLayer.add(gun);

		for(var i = 0; i < shells.length; i++){
			hud.add(shells[i]);
		}

		
		stage.add(playerLayer);
		stage.add(hud);


		startPlayer();


		skeleton.start();
		gun.start();
		window.setInterval(loop,30);
		var channel_max = 5;										// number of channels
		audiochannels = [];
		for (a=0;a<channel_max;a++) {									// prepare the channels
			audiochannels[a] = {};
			audiochannels[a]['channel'] = new Audio();						// create a new audio object
			audiochannels[a]['finished'] = -1;							// expected end time for this channel
		}
	}
}
function startPlayer(){
	player = {
		setX: function (x){
			if(x > stage.getWidth() * .7 || x < stage.getWidth() * .3 ){
				var back = skeleton.getX()-x;
				ground.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
			}else{
				skeleton.setX(x);
				gun.setX(x + ((down)?((skeleton.getScaleX() > 0)?1:-1):0)*32);
			}
		},
		setY: function (y){
			skeleton.setY(y);
			gun.setY(y+25 + ((down)?-8:0));
		},
		setDirection: function(direction){
			if(direction > 0){
				if(skeleton.getScaleX() < 0){
		      		skeleton.setScaleX(1);
		      		gun.setScaleX(.75);
		      		if (gun.getRotation() != 0 ) {
		      			gun.setRotationDeg(-gun.getRotationDeg());
		      		};
		     		player.setX(skeleton.getX()-skeleton.getWidth()/2);
		    	}
		    }else{
		    	if(skeleton.getScaleX() > 0){
			      skeleton.setScaleX(-1);
			      gun.setScaleX(-.75);
			      if (gun.getRotation() != 0 ) {
		      		gun.setRotationDeg(-gun.getRotationDeg());
		      	  };

			      player.setX(skeleton.getX()+skeleton.getWidth()/2);
			    }
		    }
		},
		shots: 6,
		canFire: function (){return player.shots > 0 && !firing;},
		fire: function (){
			player.shots--;
			gun.setAnimation('fire');
			firing = true;
			redrawShots();
			play_multi_sound('shotgun',0);
		    gun.afterFrame(4, function() {
		      gun.setAnimation('idle');
		      firing = false;
		    });
		    if(down){
		    	player.setY(skeleton.getY()-8);
		    	velocityY -= 12; 
		    }else if(skeleton.getScaleX() > 0){
		    	velocityX -= 15; 
		    }else{
		    	velocityX += 15;
		    }
		},
		reload: function (){
			if(player.shots < 6 && !firing && gun.getAnimation() != 'reload'){
				gun.setAnimation('reload');
				gun.afterFrame(4,player.reload_instant);
			}
		},
		reload_instant: function(){
		    player.shots++;
		    if(player.shots > 5){
		    	gun.setAnimation('idle');
		    }
		    redrawShots()
		    play_multi_sound('reload',.13)
			throw "reloading " + player.shots
		}
	};
}

var sounds = {};
init_sound('shotgun',5);
init_sound('reload',5 , .5);

function init_sound(type, channels, volume){
	sounds[type]=[]
	for (a=0;a<channels;a++) {									
		sounds[type][a] = {};
		sounds[type][a]['channel'] = new Audio();		
		sounds[type][a]['channel'].src = document.getElementById(type).src;	
		sounds[type][a]['channel'].load();			
		sounds[type][a]['finished'] = -1;
		if(volume)
			sounds[type][a]['channel'].volume = volume;					
	}
}

function play_multi_sound(s, start) {
	for (a=0;a<sounds[s].length;a++) {
		thistime = new Date();
		temp = sounds[s]
		if (sounds[s][a]['finished'] < thistime.getTime()) {			// is this channel finished?
			sounds[s][a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000 + start*1000;
			sounds[s][a]['channel'].currentTime = start;
			sounds[s][a]['channel'].play();
			break;
		}
	}
}