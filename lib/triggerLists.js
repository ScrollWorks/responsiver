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
        let fs = listeners.get(name).get(highLvlEvent);
        let index = fs.indexOf(f);
        if(index>=0) fs.splice(index,1);
    },
    process: (name, lowLvlEvent) => {
        console.log('processing!', name, lowLvlEvent);
        let fs = [];
        if(lowLvlEvent == "enter") {
            let enterNextListeners = listeners.get(name).get("enterNext");
            if((enterNextListeners || []).length) {
                fs.push(...enterNextListeners);
                listeners.get(name).set("enterNext", []);
            }
            fs.push(...listeners.get(name).get("enter"));
        } else if (lowLvlEvent=="leave") {
            let leaveNextListeners = listeners.get(name).get("leaveNext");
            if((leaveNextListeners || []).length) {
                fs.push(...leaveNextListeners);
                listeners.get(name).set("leaveNext", []);
            }
            fs.push(...listeners.get(name).get("leave"));
        }
        fs.forEach(f=>f());
    }
}
   