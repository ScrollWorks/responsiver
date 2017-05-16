import Breakpoint from './lib/breakpoint.js';
import triggers from './lib/triggerLists.js';
import EventTranslator from './lib/eventTranslator.js';

export default (bpDescriptions) => {
    //construct
    let bpsMap = new Map();
    let current = '';
    let bpListeners = new Map();

    let sorted = Object.keys(bpDescriptions).map((name)=>{
        return {name: name, px: bpDescriptions[name]};
    }).sort((a,b)=>{
        return a.px - b.px
    });

    sorted.forEach((bpData, i) => {
        let bp = new Breakpoint(bpData.name, sorted[i-1] ? sorted[i-1].px : 0, bpData.px);
        bpsMap.set(bpData.name, bp);
        bp.on("enter", ()=>{current = bpData.name;}, true);
    });

    //API
    return {
        getCurrent: ()=>{
            return current;
        },
        on: (bpName, event, f) => {
            triggers.add(bpName, event, f);
            makeSureReactingTo(bpName, EventTranslator.toLow(event));
        }
    }

    //private methods
    function makeSureReactingTo(name, lowLvlEvent) {
        let listeningToBp = bpListeners.has(name);
        if(listeningToBp && bpListeners.get(name).has(lowLvlEvent)) return;
        let f = triggers.process.bind(null, name, lowLvlEvent);
        if(!listeningToBp) {
            var m = new Map();
            bpListeners.set(name, m);
        }
        m.set(lowLvlEvent, f);
        bpsMap.get(name).on(lowLvlEvent, f);
    }
}


