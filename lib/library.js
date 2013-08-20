function onGround(){
	return skeleton.getY() > 150;
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
function startPlayer(){
	player = {
		setX: function (x){
			skeleton.setX(x);
			console.log()
			gun.setX(x + ((down)?((skeleton.getScaleX() > 0)?1:-1):0)*32);
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
		    gun.afterFrame(4, function() {
		      gun.setAnimation('idle');
		      firing = false;
		    });
		    if(down){
		    	player.setY(skeleton.getY()-8);
		    	velocityY -= 10; 
		    }else if(skeleton.getScaleX() > 0){
		    	velocityX -= 10; 
		    }else{
		    	velocityX += 10;
		    }
		},
		reload: function (){
			if(player.shots < 6){
				gun.setAnimation('reload');
				gun.afterFrame(6,player.reload_instant);
			}
		},
		reload_instant: function(){
			console.log('reload');
		    player.shots++;
		    if(player.shots > 5){
		    	gun.setAnimation('idle');
		    }
		  throw "reloading"
		}
	};
}

