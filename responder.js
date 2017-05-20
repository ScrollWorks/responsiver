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
        } ,
        off: (bpName, event, f) => {
            triggers.remove(bpName, event, f);
            canWeStopReactingTo(bpName, EventNames.toLow(event));
        }    
    }

    //private methods
    function makeSureReactingTo(bpName, lowLvlEvent) {
        let listeningToBp = bpListeners.has(bpName);
        if(listeningToBp && bpListeners.get(bpName).has(lowLvlEvent)) return;
        
        let f = triggers.process.bind(null, bpName, lowLvlEvent);
        
        if(listeningToBp)
            bpListeners.get(bpName).set(lowLvlEvent, f);
        else
            bpListeners.set(bpName, new Map([[lowLvlEvent, f]]));

        bpsMap.get(bpName).on(lowLvlEvent, f);
    }

    function canWeStopReactingTo(bpName, lowLvlEvent) {
        if(!EventNames.toHigh(lowLvlEvent).some((highLvlEvent) => {
            return triggers.hasListeners(bpName, highLvlEvent);
        })
        && bpListeners.has(bpName)
        && bpListeners.get(bpName).has(lowLvlEvent)) {
            bpsMap.get(bpName).off(lowLvlEvent, bpListeners.get(bpName).get(lowLvlEvent));
            bpListeners.get(bpName).delete(lowLvlEvent);
            if(!bpListeners.get(bpName).size) 
                bpListeners.delete(bpName);
        }
    }
}


