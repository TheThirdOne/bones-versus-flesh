function convert(block) {
    return {
        x: block.x*32-1,
        y: block.y*32-1,
        width: block.width*32+1, 
        height: block.height*32+1,
        type:block.type};
}
let blocktypes = "BCDRS";
function load_level_from_str(level) {
    let blocks = level.split('\n').map(l => l.split(','));
    let renderable = [];
    for (let i = 0; i < blocks.length; i++){
        let block = blocks[i];
        let x = +block[0];
        let y = +block[1];
        let width = +block[2];
        let height = +block[3];
        let type = block[4];
        if (isNaN(Math.max(x,y,width,height)) || blocktypes.indexOf(type) == -1) {
            return [];
        }
        blocks[i] = {x,y,width,height,type};
        renderable[i] = convert(blocks[i]);
    }
    return [blocks,renderable];
}

function load_level(state){
    function load_secret(){
        if (localStorage.level) {
            let level = load_level_from_str(localStorage.level);
            if (level.length) {
                return level;
            }
        }
        let level = load_level_from_str(default_level);
        if (level.length) {
            return level;
        }
        return [[],[]];
    }
    if (state.player !== undefined) {
        state.blocks = load_secret()[1];
        for (let block of state.blocks) {
            if (block.type == 'S') {
                state.player.x = state.player.checkpoint_x = block.x;
                state.player.y = state.player.checkpoint_y = block.y;
                state.camera.x = state.player.x - c.width/2;
                state.camera.y = state.player.y - c.height/3;
                continue;
            }
        }
    } else {
        [state.blocks,state.renderable] = load_secret(); 
        for (let block of state.renderable) {
            if (block.type == 'S') {
                state.x = block.x - c.width/2;
                state.y = block.y - c.height/3;
                continue;
            }
        }
    }

}

let default_level = `2,17,10,1,C
12,17,26,1,B
0,0,70,1,B
38,17,8,1,C
46,17,4,1,B
50,17,20,1,D
72,7,8,1,R
0,1,2,17,B
14,15,2,2,B
22,11,2,6,B
28,1,2,10,D
34,6,2,11,B
70,7,2,11,B
70,-22,2,23,B
80,-8,2,16,B
68,-56,2,35,B
82,-36,2,30,B
70,-56,20,2,B
84,-36,6,1,C
90,-36,2,8,B
92,-30,100,2,D
192,-34,10,6,B
202,-30,55,2,D
131,-36,6,2,B
153,-36,10,2,B
182,-36,12,2,B
194,-36,6,2,C
200,-36,12,2,B
249,-33,14,2,B
90,-68,2,14,B
92,-68,44,2,B
136,-68,2,26,B
138,-44,120,2,D
110,-50,2,20,D
5,10,2,2,S
263,-33,2,13,B
269,-30,2,2,B
272,-34,2,2,B
274,-38,2,2,B`;
