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

let default_level = `5,10,1,1,S
3,14,6,2,C
9,14,10,2,B
1,-20,2,36,B
17,12,14,2,B
23,7,2,5,B
36,12,8,2,B
31,14,5,2,D
29,14,2,2,B
36,14,2,2,B
42,14,2,2,B
44,14,11,2,D
55,11,2,5,B
55,9,10,2,B
65,1,2,10,B
67,1,4,2,B
71,-35,2,38,B
49,-6,9,2,B
32,-14,10,2,B
1,-22,22,2,B
9,-35,62,2,B
3,-24,6,2,C
-15,-63,2,43,B
-7,-22,2,11,B
-28,-11,23,2,D
-21,-13,6,2,B
-22,-20,9,2,B
-28,-27,2,16,B
-28,-31,2,4,D
-37,-27,9,2,B
-43,-42,28,2,B
-43,-40,2,20,D
-95,-13,9,2,B
-30,-13,2,2,B
-120,-20,83,2,D
-37,-13,7,2,C
-41,-13,4,2,B
-118,-11,79,2,D
-62,-13,7,2,B
-112,-18,6,2,D
-116,-19,20,2,D
-124,-12,6,2,B
-130,-33,2,23,B
-148,-29,14,2,D
-128,-12,4,2,C
-134,-21,3,2,R
1,-51,2,29,B
-13,-33,6,2,B
-5,-22,6,2,C
7,-52,37,1,D
9,-42,2,7,B
3,-51,43,2,B
18,-49,2,7,B
11,-36,37,1,D
24,-38,8,2,B
42,-38,8,2,B
37,-49,2,8,B
48,-36,8,1,B
50,-38,6,2,C
56,-63,2,28,B
42,-75,2,1,D
45,-85,2,11,B
-15,-65,73,2,B
3,-53,2,2,B
44,-53,2,2,B
5,-55,2,4,B`;
