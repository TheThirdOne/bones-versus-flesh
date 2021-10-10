var jump = 32, down = 83, left = 65, right = 68, up=87, reload=82;
function new_state() {
    return {
            player: {x:100,y:100,width:32,height:64, 
                     vy: 0, vx: 0,
                    anim:"idle", anim_frame:0, anim_time: 0,
                    gun_x: 16, gun_y: 32, gun_width: 48, gun_height:24,
                    gun_anim:"idle", gun_anim_frame: 0, gun_anim_time: 0,
                    ammo: 6, can_fire: true, grounded: false,
                    checkpoint_x : 100, checkpoint_y : 200,
                }, 
            mouse: {x:0,y:0, down:false},
            camera: {x:0,y:0},
            keys: [],
    };
}

function block(x, y,width,height, type = "B") {
    return {
        x : x*64-1,
        y : y*64-1,
        width: width*64+1,
        height: height*64+1,
        type
    };
}


function render(state) {

    // Main Character
    ctx.clearRect(0,0,c.width,c.height);
    let player = state.player;
    let camera = state.camera;
    let anim = body_animation[player.anim][player.anim_frame];
    ctx.save()
    ctx.translate(player.x-camera.x+player.width/2,0);
    if (player.facing_left) {
        ctx.scale(-1,1);
    }
    ctx.drawImage(body_animation.image,
        anim.x,anim.y,anim.width,anim.height,
        -player.width/2,player.y - camera.y,player.width,player.height);
    ctx.restore();

    
    // shotgun drawing
    ctx.beginPath();
    ctx.moveTo(player.x + player.gun_x - camera.x, player.y+player.gun_y - camera.y);
    ctx.lineTo(state.mouse.x, state.mouse.y);
    ctx.stroke();
    ctx.save();
    ctx.translate(player.x + player.gun_x - camera.x, player.y+player.gun_y-camera.y) ;
    ctx.beginPath();
    let diff_x = state.mouse.x - (player.x + player.gun_x - camera.x);
    let diff_y = state.mouse.y - (player.y + player.gun_y - camera.y);
    let angle = 0.5*Math.PI-Math.atan2(diff_x,diff_y);
    ctx.rotate(angle);
    if (angle > 0.5*Math.PI) {
        ctx.scale(1,-1);
    }
    anim = shotgun_animation[player.gun_anim][player.gun_anim_frame];
    ctx.drawImage(shotgun_animation.image,
        anim.x,anim.y,anim.width,anim.height,
        -10,-12,player.gun_width,player.gun_height);
    ctx.restore();
    
    // Terrain
    //ctx.beginPath();
    for (let block of state.blocks) {
        if (block.type == "C") {
            ctx.fillStyle = "#FFFF00"
        } else if (block.type == "D") {
            ctx.fillStyle = "#FF0000"
        } else if (block.type == "B") {
            ctx.fillStyle = "#000000"
        } else if (block.type == "I") {
            ctx.fillStyle = "#AAAAFF"
        } else if (block.type == "R") {
            ctx.fillStyle = "#00FF00"
        } else if (block.type == "S") {
            continue;
        }
        ctx.fillRect(block.x - state.camera.x,block.y - state.camera.y,block.width,block.height);
    }
    //ctx.stroke();
    // Ammo
    for (let i = 0; i < state.player.ammo; i += 1) {
        ctx.drawImage(ammo,50+i*24,16,16,32);
    }

}

function update_animation(delta,state, actions) {
    for (action of actions) {
        if (action == "landed") {
            state.player.anim = "idle";
            state.player.anim_frame = 0;
            state.player.anim_time = 0;
        } else if (action == "jumped") {
            state.player.anim = "jump";
            state.player.anim_time = 0;
        } else if (action == "shot") {
            state.player.gun_anim = "fire";
            state.player.gun_anim_time = 0;
        } else if (action == "reload") {
            state.player.gun_anim = "reload";
            state.player.gun_anim_time = 0;
        } else if (action == "full_reload") {
            state.player.gun_anim = "idle";
            state.player.gun_anim_time = 0;
        } else if (action == "death") {
            changed = true;
            replays.unshift([]);
            state.player.vx = 0;
            state.player.x = state.player.checkpoint_x;
            state.player.vy = 0;
            state.player.y = state.player.checkpoint_y;
            state.camera.x = state.player.x - c.width/2;
            state.camera.y = state.player.y - c.height/3;
            state.player.ammo = 6;
            state.player.anim = "idle";
            state.player.anim_time = 0;
            state.player.gun_anim = "idle";
            state.player.gun_anim_time = 0;
        }
    }
    if (state.keys[left] != state.keys[right]) {
        state.player.facing_left = state.keys[left] && !state.keys[right];
    }
    let runnable = state.player.grounded && (state.keys[left] != state.keys[right]);
    if (state.player.anim == "idle" && runnable) {
        state.player.anim = "run";
        state.player.anim_time = 0;
    }
    if (delta > 50) {
        delta = 50;
    }
    state.player.anim_time += delta/1000;
    state.player.gun_anim_time += delta/1000;
    
    if (body_animation[state.player.anim].length <= state.player.anim_time*8) {
        state.player.anim_time -= body_animation[state.player.anim].length/8;
        if (state.player.anim == "run" && !runnable) {
            state.player.anim = "idle";
        }
        if (state.player.anim == "jump") {
            state.player.anim = "jump_stay";
        }
        
    }
    if (shotgun_animation[state.player.gun_anim].length <= state.player.gun_anim_time*12) {
        state.player.gun_anim_time -= shotgun_animation[state.player.gun_anim].length/12;
        if (state.player.gun_anim == "fire") {
            state.player.gun_anim = "idle";
        } else if (state.player.gun_anim == "reload") {
            state.player.ammo += 1;
	    play_multi_sound('reload',.13);
            if (!state.keys[reload] || state.player.ammo >= 6) {
                state.player.gun_anim = "idle";
            }
        }
    }

    state.player.anim_frame = (state.player.anim_time*8)|0;
    state.player.gun_anim_frame = (state.player.gun_anim_time*12)|0;
}

var C = {
    gravity : 1.1,
    jump: -450,
    friction: 0.985,
    ground_accel: 3.2,
    air_accel: 0.1,
    shotgun_power: -450,
};

function update(delta,state) {
    let actions = [];
    var colliding = false;
    var grounded = false;
    for (var block of state.blocks) {
        if (block.type == "S") {
            continue;
        }
        if (collides(state.player, block)) {
            depths = collision_depth(state.player,block);
            let min_index = 0;
            for (let i = 1; i < 4; i += 1) {
                if (depths[i] > depths[min_index]) {
                    min_index = i;
                }
            }
            if (block.type == 'D') {
                return ["death"]; 
            }
            if (block.type == 'R') {
                state.player.ammo = 6;
                actions.push("full_reload"); 
            }
            // Push the player out of the block and stop their momentum in that direction
            let odd = min_index % 2 == 0;
            let amount = odd ? -depths[min_index] : depths[min_index];
            let speed = min_index < 2 ? state.player.vx : state.player.vy;
            if ((speed > 0) != (amount > 0)) {
                speed = 0;
            }
            if(min_index < 2) {
                state.player.vx = speed;
                state.player.x += amount;
            } else {
                state.player.vy = speed;
                state.player.y += amount;
            }
            if (block.type == 'C') {
                state.player.checkpoint_x = state.player.x;
                state.player.checkpoint_y = state.player.y;
            }
            grounded ||= min_index == 3;
            colliding = true;
        }
    }
    if (state.player.y > 9000) {
        return ["death"]; 
    }
    // Handle Gravity, player movement and jump
    if (grounded && !state.player.grounded) {
        actions.push("landed");
    }
    if (grounded) {
        state.player.vx *= Math.pow(C.friction,delta);
    } else {
        state.player.vy += C.gravity*delta;
    }
    if ((state.grounded || grounded) && state.keys[jump]) {
        actions.push("jumped");
        state.player.vy = C.jump;
        grounded = false;
    }    
    let acceleration = grounded ? C.ground_accel : C.air_accel;
    if (state.keys[left] && !state.keys[right]) {
        state.player.vx -= acceleration*delta;
    }
    if (!state.keys[left] && state.keys[right]) {
        state.player.vx += acceleration*delta;
    }

    
    if (state.mouse.down && state.player.ammo > 0 && state.player.gun_anim == "idle")  {
        state.mouse.down = false;
        actions.push("shot");
        let player = state.player;
        let camera = state.camera;
        console.log('Fired weapon: ', state.player.x, state.player.y, state.player.vx,state.player.vy,state.mouse.x,state.mouse.y);
        let diff_x = state.mouse.x - (player.x + player.gun_x - camera.x);
        let diff_y = state.mouse.y - (player.y + player.gun_y - camera.y);
        let length = Math.sqrt(diff_x*diff_x + diff_y*diff_y);
        
        diff_x /= length;
        diff_y /= length;
        let dot = Math.sqrt(Math.max(0,diff_x*state.player.vx + diff_y*state.player.vy));
        let pow = C.shotgun_power - 6*dot;
        state.player.vy += diff_y * pow;
        state.player.vx += diff_x * pow;
	state.player.ammo--;
        play_multi_sound('shotgun',0);
    } else if (state.keys[reload] && state.player.ammo < 6 && state.player.gun_anim == "idle")  {
        actions.push("reload");
    }
    
    state.player.x += state.player.vx*delta/1000;
    state.player.y += state.player.vy*delta/1000;
    /*
    if (frame % 10 == 0) {
        replays[0].xs.push(state.player.x); 
        replays[0].ys.push(state.player.y); 
    }*/
    // Camera following
    function scale(n) {
        if (n < 200) {
            return 4/1000
        } else if (n < 700) {
            return (n-200)/1000 + 4/1000;
        } else {
            return 44/1000;
        }
    }
    let cam_diff_x = state.player.x  - c.width/2 - state.camera.x;
    if (Math.abs(cam_diff_x) > 200) {
        state.camera.x += cam_diff_x*scale(Math.abs(cam_diff_x));
    }
    let cam_diff_y = state.player.y - c.height/3 - state.camera.y;
    if (Math.abs(cam_diff_y) > 200) {
        state.camera.y += cam_diff_y*scale(Math.abs(cam_diff_y));
    }
    state.player.grounded = grounded;
    return actions;
} 


function collides(a,b) {
    return a.x <= b.x + b.width &&
   a.x + a.width >= b.x &&
   a.y <= b.y + b.height &&
   a.y + a.height >= b.y;
}

function collision_depth(a,b) {
    return [a.x - (b.x + b.width),
        -(a.x + a.width) + b.x,
        a.y  - (b.y + b.height),
        -(a.y + a.height) + b.y];
}
