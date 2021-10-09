var c = document.getElementById("c");
var ctx = c.getContext("2d");

var state = {blocks:[],renderable:[], x: 0, y:0, mouse:{type:'',index:-1,x:0,y:0,dx:0,dy:0}};
function block(x, y,width,height, type = "B") {
    state.renderable.push({
        x : x*64-1,
        y : y*64-1,
        width: width*64+1,
        height: height*64+1,
        type
    });
    state.blocks.push({
        x: x*2,y: y*2,width:width*2,height:height*2,type
    })
}

load_level(state);
function render(state) {
    let camera = {x: state.x, y:state.y};
    if (state.mouse.type == 'camera') {
        camera.x -= state.mouse.dx;
        camera.y -= state.mouse.dy;
    }
    ctx.clearRect(0,0,c.width,c.height);
    // Grid
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.beginPath();
    let x_start = Math.floor((camera.x-32)/32)*32 - camera.x;
    let y_start = Math.floor((camera.y-32)/32)*32 - camera.y;
    for (let i = 0; i < c.width/32 + 2; i++) {
        ctx.moveTo(x_start+i*32,y_start);
        ctx.lineTo(x_start+i*32,c.height+y_start+64);
    }
    for (let i = 0; i < c.height/32 + 2; i++) {
        ctx.moveTo(x_start,y_start+i*32);
        ctx.lineTo(c.width+x_start+64,y_start+i*32);
    }
    ctx.stroke();
    // Terrain
    let transformed; 
    //ctx.beginPath();
    for(let i = 0; i < state.renderable.length; i++){
        let block = state.renderable[i];
        if (state.mouse.type == 'move' && i == state.mouse.index) {
            block = Object.assign({},block);
            block.x += state.mouse.dx;
            block.y += state.mouse.dy;
            transformed = block;
        }else if (state.mouse.type == 'edge' && i == state.mouse.index) {
            block = Object.assign({},block);
            transformed = block;
            let edge = state.mouse.edge, dx = state.mouse.dx, dy = state.mouse.dy;
            if (edge == 0) {
                block.y += dy;
                block.height -= dy;
            } else if (edge == 1) {
                block.height += dy;
            } else if (edge == 2) {
                block.x += dx;
                block.width -= dx;
            } else if (edge == 3) {
                block.width += dx;
            }
        }
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
            ctx.fillStyle = "rgba(0,255,0,0.3)"
        }
        ctx.fillRect(block.x - camera.x,block.y - camera.y, block.width, block.height);
    }
    //ctx.stroke();
    
    if (state.mouse.type == 'move') {
        let block = transformed;
        ctx.strokeStyle = "#CCCCFF";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(block.x - camera.x,block.y - camera.y, block.width, block.height);
        ctx.stroke();
    } else if (state.mouse.type == 'edge') {
        let block = transformed;
        block.x -= camera.x;
        block.y -= camera.y;
        let edge = state.mouse.edge;
        ctx.strokeStyle = "#CCFFCC";
        ctx.lineWidth = 5;
        ctx.beginPath();
        if (edge == 0) {
            ctx.moveTo(block.x,block.y);
            ctx.lineTo(block.x+block.width,block.y);
        } else if (edge == 1) {
            ctx.moveTo(block.x,block.y+block.height);
            ctx.lineTo(block.x+block.width,block.y+block.height);
        } else if (edge == 2) {
            ctx.moveTo(block.x,block.y);
            ctx.lineTo(block.x,block.y+block.height);
        } else if (edge == 3) {
            ctx.moveTo(block.x+block.width,block.y);
            ctx.lineTo(block.x+block.width,block.y+block.height);
        }
        ctx.stroke();
    } else if (state.mouse.index != -1) {
        let block = state.renderable[state.mouse.index];
        ctx.strokeStyle = "#CCCCFF";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(block.x - camera.x,block.y - camera.y, block.width, block.height);
        ctx.stroke();

    }
}

c.onmousemove = function (e) {
    if (state.mouse.type == ''){
        return;
    } else {
        state.mouse.dx = e.layerX - state.mouse.x;
        state.mouse.dy = e.layerY - state.mouse.y;
        render(state);
    }
}
c.onmousedown = function (e) {
    state.mouse.dx = e.layerX - state.mouse.x;
    state.mouse.dy = e.layerY - state.mouse.y;
    if (state.mouse.type) {
        commit_action(state);    
    }
    state.mouse.x = e.layerX;
    state.mouse.y = e.layerY;
    state.mouse.dx = 0;
    state.mouse.dy = 0;    
    // set action
    if (e.which == 1) {
        let index = -1;
        let target = {x: state.mouse.x + state.x, y: state.mouse.y + state.y};    
        for (let i = 0; i < state.renderable.length; i+=1) {
            if (inside(target,state.renderable[i])) {
                index = i;
                break;
            }
        }
        state.mouse.index = -1;
        if (index != -1) {
            if (e.altKey) {
                state.blocks.splice(index,1);
                state.renderable.splice(index,1);
            } else {
                state.mouse.type = 'move';
                state.mouse.index = index;
            }
        }
    }else if (e.which == 2) {
        state.mouse.type = 'camera';
    }else if (e.which == 3 && !e.altKey) {
        let index = -1;
        let edge = 0;
        let best = Infinity;
        let target = {x: state.mouse.x + state.x, y: state.mouse.y + state.y};
        let abs = Math.abs;
        let z = n => Math.max(0,n);  
        for (let i = 0; i < state.renderable.length; i+=1) {
            let block = state.renderable[i];
            let up    = block.y - target.y;
            let down  = -(block.y + block.height) + target.y;
            let left  = block.x - target.x;
            let right = -(block.x + block.width) + target.x;
            let edges = [
                abs(up)/2    +z(left) + z(right),
                abs(down)/2  +z(left) + z(right),
                abs(left)/2  +z(up)   + z(down),
                abs(right)/2 +z(up)   + z(down)
                ];
            let min = Math.min(...edges);
            if (min < best) {
                index = i;
                edge = edges.indexOf(min);    
                best = min;
            }
        }
        if (index != -1) {
            state.mouse.type = 'edge';
            state.mouse.index = index;
            state.mouse.edge = edge;
        }
        state.mouse.index = index;
    }else if (e.which == 3 && e.altKey) {
        let target = {x: Math.round((state.mouse.x + state.x)/32), y: Math.round((state.mouse.y + state.y)/32), width:2, height:2,type:'B'};
        state.blocks.push(target);
        state.renderable.push(convert(target))
        state.mouse.index = state.blocks.length - 1;
    }
    render(state);
}

function inside(mouse,shape) {
    return mouse.x < shape.x + shape.width  && mouse.x > shape.x &&
           mouse.y < shape.y + shape.height && mouse.y > shape.y;
}

c.oncontextmenu = function (){return false;};
c.onmouseup= function (e) {
    state.mouse.dx = e.layerX - state.mouse.x;
    state.mouse.dy = e.layerY - state.mouse.y;
    if (state.mouse.type) {
        commit_action(state);    
    }
    render(state);
}

document.onkeydown = function(e) {
    let i = state.mouse.index; 
    if (e.key == 'Escape') {
        state.mouse.dx = 0;
        state.mouse.dy = 0;    
        state.mouse.type = '';
        state.mouse.index = -1;
    } else if (e.key == 'ArrowDown' && i != -1) {
        let type = state.blocks[i].type;
        let index = blocktypes.indexOf(type)  + 1;
        index = index % blocktypes.length;
        state.blocks[i].type = blocktypes[index];
        state.renderable[i].type = blocktypes[index];
        render(state);
    } else if (e.key == 'ArrowUp' && i != -1) {
        let type = state.blocks[i].type;
        let index = blocktypes.indexOf(type) + blocktypes.length - 1;
        index = index % blocktypes.length;
        state.blocks[i].type = blocktypes[index];
        state.renderable[i].type = blocktypes[index];
        render(state);
    }
    if (!e.ctrlKey){
        return;
    }
    if (e.key == 's') {
        level = state.blocks.map(b=>`${b.x},${b.y},${b.width},${b.height},${b.type}`).join("\n");
        localStorage.level = level;
    } else if (e.key == 'd') {
        let link = document.createElement('a');
        level = state.blocks.map(b=>`${b.x},${b.y},${b.width},${b.height},${b.type}`).join("\n");
        link.download = 'level.txt';
        link.href = 'data:text/plain;base64,'+btoa(level)
        link.click()
    } else if (e.key == 'p') {
        window.location.href = '/';
    }
    return false;
}
function commit_action(state) {
    changed = true;
    if (state.mouse.type == 'camera') {
        state.x -= state.mouse.dx;
        state.y -= state.mouse.dy;
    } else if (state.mouse.type == 'move'){
        let dx = Math.round(state.mouse.dx/32);
        let dy = Math.round(state.mouse.dy/32);
        let i = state.mouse.index;
        state.blocks[i].x += dx;
        state.blocks[i].y += dy;
        state.renderable[i] = convert(state.blocks[i]);
    } else if (state.mouse.type == 'edge') {
        let dx = Math.round(state.mouse.dx/32);
        let dy = Math.round(state.mouse.dy/32);
        let i = state.mouse.index;
        let edge = state.mouse.edge;
        let block = Object.assign({},state.blocks[i]);
        if (edge == 0) {
            block.y += dy;
            block.height -= dy;
        } else if (edge == 1) {
            block.height += dy;
        } else if (edge == 2) {
            block.x += dx;
            block.width -= dx;
        } else if (edge == 3) {
            block.width += dx;
        }
        if (block.width > 0 && block.height > 0) {
            state.blocks[i] = block;
            state.renderable[i] = convert(block);
        }
    }
    level = state.blocks.map(b=>`${b.x},${b.y},${b.width},${b.height},${b.type}`).join("\n");
    state.mouse.dx = 0;
    state.mouse.dy = 0;    
    state.mouse.type = '';
}
