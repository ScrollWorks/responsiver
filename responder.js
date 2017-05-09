import Breakpoint from './lib/breakpoint.js';

class Responder {
    constructor(bps) {
        this._bps=[];
        this._bpsMap = new Map();
        Object.keys(bps).forEach((name)=>{
            let bp = new Breakpoint(name, bps[name]);
            this._bps.push(bp);
            this._bps.sort(Breakpoint.sort);
            this._bpsMap.set(name, bp);

        });
        console.log(this);

    }
}

export default Responder;