import Breakpoint from './lib/breakpoint.js';

class Responder {
    constructor(bps) {
        this._bpsMap = new Map();
        this._current = '';

        let sorted = Object.keys(bps).map((name)=>{
            return {name: name, px: bps[name]};
        }).sort((a,b)=>{
            return a.px - b.px
        });

        sorted.forEach((bpData, i) => {
            let bp = new Breakpoint(bpData.name, sorted[i-1] ? sorted[i-1].px : 0, bpData.px);
            this._bpsMap.set(bpData.name, bp);
            bp.on("enter", ()=>{this._current = bpData.name;}, true);
        });
        console.log(this._current);
    }
}

export default Responder;