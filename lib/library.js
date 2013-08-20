function onGround(){
	return skeleton.getY() > 50;
}


function shoot(){
	shots--;
	gun.setAnimation('fire');
    gun.afterFrame(4, function() {
      gun.setAnimation('idle');
    });
}
function land(){
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
var goingLeft = false, goingRight = false, jumped = false, reloading = false;
var velocity = 0;

function loop(){
	if(goingRight){
		player.setX(skeleton.getX()+5);
	}else if(goingLeft){
		player.setX(skeleton.getX()-5);
	}
	if(!onGround()){
		velocity += 1;
		player.setY(skeleton.getY()+velocity);
	}else{
		if(jumped){
			land();
			jumped = false;
		}
		velocity = 0;
	}
}
var player;
function startPlayer(){
	player = {
		setX: function (x){
			skeleton.setX(x);
			gun.setX(x);
		},
		setY: function (y){
			skeleton.setY(y);
			gun.setY(y+25);
		},
		setDirection: function(direction){
			if(direction > 0){
				if(skeleton.getScaleX() < 0){
		      		skeleton.setScaleX(1);
		      		gun.setScaleX(.75);
		     		player.setX(skeleton.getX()-skeleton.getWidth()/2);
		    	}
		    }else{
		    	if(skeleton.getScaleX() > 0){
			      skeleton.setScaleX(-1);
			      gun.setScaleX(-.75);
			      player.setX(skeleton.getX()+skeleton.getWidth()/2);
			    }
		    }
		},
		shots: 6,
		canFire: function (){return player.shots > 0;},
		fire: function (){
			player.shots--;
			gun.setAnimation('fire');
		    gun.afterFrame(4, function() {
		      gun.setAnimation('idle');
		    });
		},
		reload: function (){
			if(player.shots < 6){
				gun.setAnimation('reload');
				gun.afterFrame(6,player.reload_instant);
			}
		},
		reload_instant: function(){
			console.log('reload');
		    /*player.shots++;*/
		    gun.setAnimation('reload');
		    gun.afterFrame(6,player.reload_instant);
		    return true;
		    /*if(player.shots > 6){
		    	gun.setAnimation('idle');
		    }*/
		}
	};
}