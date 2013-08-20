function onGround(){
	return skeleton.getY() > 300;
}
function collide(){

}
function shoot(){
	shots--;
	gun.setAnimation('fire');
    gun.afterFrame(4, function() {
      gun.setAnimation('idle');
    });
}
function land(){
	velocityX = 0;
	velocityY = 0;
	if((goingRight||goingLeft)&&(keys[65]||keys[68])){
		if(goingRight){
			bindingsDown[68]();
			return;
		}
		if(goingLeft){
			bindingsDown[65]();
			return;
		}
	}
	skeleton.setAnimation('idle');
	goingRight = false;
	goingLeft = false;
}
var goingLeft = false, goingRight = false, jumped = false, reloading = false, down = false, firing = false;
var velocityY = 0, velocityX = 0;
var countdown = 3;

function loop(){
	if(!onGround()){
		velocityY += 1;
		
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
  		stage.add(ground);
  		block.start();
		// add the shape to the layer
	  playerLayer.add(skeleton);

	  // add the layer to the stage
	  stage.add(playerLayer);
	  startPlayer();
	  // start sprite animation
	  skeleton.start();

	  // add the shape to the layer
	  playerLayer.add(gun);

	  // start sprite animation
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
			play_multi_sound('shotgun_sound');
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
				gun.afterFrame(6,player.reload_instant);
			}
		},
		reload_instant: function(){
		    player.shots++;
		    if(player.shots > 5){
		    	gun.setAnimation('idle');
		    }
		  throw "reloading " + player.shots
		}
	};
}


function play_multi_sound(s) {
	for (a=0;a<audiochannels.length;a++) {
		thistime = new Date();
		if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
			audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
			audiochannels[a]['channel'].src = document.getElementById(s).src;
			audiochannels[a]['channel'].load();
			audiochannels[a]['channel'].play();
			break;
		}
	}
}