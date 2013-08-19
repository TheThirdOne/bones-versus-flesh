function onGround(){
	return skeleton.getY() > 50;
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
var goingLeft = false, goingRight = false, jumped = false;
var velocity = 0;

function loop(){
	if(goingRight){
		skeleton.setX(skeleton.getX()+5);
	}else if(goingLeft){
		skeleton.setX(skeleton.getX()-5);
	}
	if(!onGround()){
		velocity += 1;
		skeleton.setY(skeleton.getY()+velocity);
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
		getX: skeleton.getX,
		getY: skeleton.getY,
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
		      		gun.setScaleX(1);
		     		setX(getX()-skeleton.getWidth()/2);
		    	}
		    }else{
		    	if(skeleton.getScaleX() > 0){
			      skeleton.setScaleX(-1);
			      gun.setScaleX(-1);
			      setX(getX()+skeleton.getWidth()/2);
			    }
		    }
		}
	};
}