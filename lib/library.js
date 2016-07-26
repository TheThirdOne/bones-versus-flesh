function onGround(sprite){
	return collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.1,sprite.getY()+64)||
	       collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.4,sprite.getY()+64);
}
function collideHead(sprite){
	return  collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.1,sprite.getY())||
	        collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.4,sprite.getY());
}
function collideLeft(sprite){
	if(sprite.getScaleX() > 0)
		return collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.8)
		||collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.2);
	else
		return collide(sprite.getX() - sprite.getWidth()/2,sprite.getY()+sprite.getHeight()*.8)
		||collide(sprite.getX() - sprite.getWidth()/2,sprite.getY()+sprite.getHeight()*.2);
}
function collideRight(sprite){
	if(sprite.getScaleX() > 0)
		return collide(sprite.getX() + sprite.getWidth()/2,sprite.getY()+sprite.getHeight()*.8)
		||collide(sprite.getX() + sprite.getWidth()/2,sprite.getY()+sprite.getHeight()*.2);
	else
		return collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.8)
		||collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.2);
}
function collide(x,y){
	var temp = ground.getChildren();
	for(var i = 0; i < temp.length; i++){
		if(testCollision(temp[i],x,y)){
			return true;
		}
	}
	return false;
}
function testCollision(object, x, y){
	if(object.getX() > x || object.getX() + object.getWidth() < x)
			return false;
	if(object.getY() > y || object.getY() + object.getHeight() < y)
			return false;
	return true;
}
function redrawShots(){
	for (var i = 0; i < shells.length; i++) {
		shells[i].setVisible(i < player.shots);
	}
	hud.draw();
}
function land(){
	var temp = (velocityY > 0)?1:-1;
	for(var i = 0; i < velocityY * temp; i++){
		player.setY(skeleton.getY()-temp);
		if(!onGround(skeleton)){
			break;
		}
	}
	player.setY(skeleton.getY()+temp);
	velocityX = 0;
	velocityY = 0;

	skeleton.setAnimation('idle');
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
	constants.goingRight = false;
	constants.goingLeft = false;
}
var velocityY = 0, velocityX = 0;
var countdown = 4; //used for loading stuff
var constants = {
	gravity: .9,
	walkSpeed: 5,
	maxShots: 6,
	shotgunSidePower: 15,
	shotgunVerticalPower: 12
};
var env = {
	goingLeft: false,
	goingRight: false,
	jumped: false,
	reloading: false,
	pointdown: false,
	pointup: false,
	firing: false,
};
var last = performance.now();
function loop(){
  var delta = performance.now()-last;
  console.log(1000/delta);
  last = performance.now();
	if(!onGround(skeleton)){
	  if(collideHead(skeleton)&&velocityY<0){
	    velocityY = 0;
	  }
		velocityY += constants.gravity*delta/30;
		if(skeleton.getAnimation() == 'run' ){
			skeleton.setAnimation('jump_stay');
		}
		constants.jumped=true;
	}else{
		if(constants.goingRight){
			velocityX = constants.walkSpeed;
		}else if(constants.goingLeft){
			velocityX = -constants.walkSpeed;
		}else{
			velocityX = 0;
		}
		if(constants.jumped){
			land();
			constants.jumped = false;
		}
		velocityY = 0;
	}
	if(collideLeft(skeleton)&&velocityX < 0){
	  velocityX = 0;
	}
	if(collideRight(skeleton)&&velocityX > 0){
	  velocityX = 0;
	}
	player.setY(skeleton.getY()+velocityY*delta/30);
	player.setX(skeleton.getX()+velocityX*delta/30);
	requestAnimationFrame(loop);
}
var player;
function start(){
	countdown--;
	if(countdown <= 0){
		console.log(blocks);
		for(var i = 0;i < blocks.length;i++){
		  ground.add(blocks[i]);
		  blocks[i].start();
		}
		
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
		requestAnimationFrame(loop);
	}
}
function startPlayer(){
	player = {
		setX: function (x, ignoreBoundaries){
			if(!ignoreBoundaries){
				var back = skeleton.getX()-x;
				ground.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
			}
			gun.setX(skeleton.getX() + ((constants.pointdown)?((skeleton.getScaleX() > 0)?1:-1):0)*32);
		},
		setY: function (y){
			if(y > stage.getHeight() * .7 || y < stage.getHeight() * .3){
  			var back = skeleton.getY() - y;
  			ground.getChildren().each(function (node,n){
  					node.setY(node.getY()+back);
  				});
  			gun.setY(skeleton.getY()+25 + ((constants.pointdown)?-8:0) + ((constants.pointup)?8:0));
  		}else{
  		  skeleton.setY(y);
  			gun.setY(y+25 + ((constants.pointdown)?-8:0) + ((constants.pointup)?8:0));
			}
		},
		setDirection: function(direction){
			if(direction > 0){
				if(skeleton.getScaleX() < 0){
		      		skeleton.setScaleX(1);
		      		gun.setScaleX(.75);
		      		if (gun.getRotation() !== 0 ) {
		      			gun.setRotationDeg(-gun.getRotationDeg());
		      		}
		     		skeleton.setX(skeleton.getX()-skeleton.getWidth()/2);
		    	}
		    }else{
		    	if(skeleton.getScaleX() > 0){
			      skeleton.setScaleX(-1);
			      gun.setScaleX(-.75);
			      if (gun.getRotation() !== 0 ) {
		      		gun.setRotationDeg(-gun.getRotationDeg());
		      	}

			      skeleton.setX(skeleton.getX()+skeleton.getWidth()/2);
			    }
		    }
		},
		shots: constants.maxShots,
		canFire: function (){return player.shots > 0 && !constants.firing;},
		fire: function (){
			player.shots--;
			gun.setAnimation('fire');
			constants.firing = true;
			redrawShots();
			play_multi_sound('shotgun',0);
		    gun.afterFrame(4, function() {
		      gun.setAnimation('idle');
		      constants.firing = false;
		    });
		    if(constants.pointdown){
		    	player.setY(skeleton.getY()-1);
		    	velocityY -= constants.shotgunVerticalPower;
		    }else if(constants.pointup){
		    	player.setY(skeleton.getY()+1);
		    	velocityY += constants.shotgunVerticalPower;
		    }else if(skeleton.getScaleX() > 0){
		    	velocityX -= constants.shotgunSidePower;
		    	player.setY(skeleton.getY()-2);
		    }else{
		    	player.setY(skeleton.getY()-2);
		    	velocityX += constants.shotgunSidePower;
		    }
		},
		reload: function (){
			if(player.shots < constants.maxShots && !constants.firing && gun.getAnimation() != 'reload'){
				gun.setAnimation('reload');
				gun.afterFrame(4,player.reload_instant);
			}
		},
		reload_instant: function(){
		    player.shots++;
		    if(player.shots >= constants.maxShots){
		    	gun.setAnimation('idle');
		    }
		    redrawShots();
		    play_multi_sound('reload',.13);
			throw "reloading " + player.shots
		}
	};
}

var sounds = {};
init_sound('shotgun',5, .5);
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