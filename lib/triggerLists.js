import EventNames from './eventNames.js';

let listeners = new Map();
export default {
    add: (name, highLvlEvent, f) => {
        if(listeners.has(name)) {
            if(listeners.get(name).has(highLvlEvent)) {
                listeners.get(name).get(highLvlEvent).push(f);
            } else {
                listeners.get(name).set(highLvlEvent, [f]);
            }
        } else {
            listeners.set(name, new Map([[highLvlEvent, [f]]]));
        }
    },
    remove: (name, highLvlEvent, f) => {
        if(!hasListeners(name, highLvlEvent))
            return;

        let fs = listeners.get(name).get(highLvlEvent);
        let index = fs.indexOf(f);
        if(index>=0) 
            if(fs.length>1) fs.splice(index,1);
            else listeners.get(name).delete(highLvlEvent);
    },
    process: function(bpName, lowLvlEvent) {
        let fs = [];
        EventNames.toHigh(lowLvlEvent).filter(hasListeners.bind(this, bpName)).forEach((highLvlEvent)=>{
            fs.push(...listeners.get(bpName).get(highLvlEvent));
            if(highLvlEvent.includes(EventNames.next)) {
                listeners.get(bpName).delete(highLvlEvent);
                tryToCleanListeners(bpName);
            }
        });
        fs.forEach(f=>f());
    },
    hasListeners: hasListeners
}


function hasListeners(bpName, highLvlEvent) {
    return listeners.has(bpName) && listeners.get(bpName).has(highLvlEvent);
}

function tryToCleanListeners(bpName, event) {
    if(!listeners.get(bpName).size) listeners.delete(bpName);
}