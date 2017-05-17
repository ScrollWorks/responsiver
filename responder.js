import Breakpoint from './lib/breakpoint.js';
import triggers from './lib/triggerLists.js';
import EventNames from './lib/eventNames.js';

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
            let lowLvlEvent = EventNames.toLow(event);
            if(current == bpName && lowLvlEvent == "enter") {
                f();
                if(event == "enterNext") return;
            }
            triggers.add(bpName, event, f);
            makeSureReactingTo(bpName, lowLvlEvent);
        },
        enterCurrent: () => {
            triggers.process(current, "enter");
        }
    }

    //private methods
    function makeSureReactingTo(name, lowLvlEvent) {
        let listeningToBp = bpListeners.has(name);
        if(listeningToBp && bpListeners.get(name).has(lowLvlEvent)) return;
        
        let f = triggers.process.bind(null, name, lowLvlEvent);
        
        if(listeningToBp)
            bpListeners.get(name).set(lowLvlEvent, f);
        else
            bpListeners.set(name, new Map([[lowLvlEvent, f]]));

        bpsMap.get(name).on(lowLvlEvent, f);
    }
}


