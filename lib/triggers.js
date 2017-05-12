export default function(bps) {
    let listeners = new Map();
    let internalTriggers = new Map();
    return {
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

            makeSureReactingTo(name, translateEvent(highLvlEvent));
        },
        remove: (name, highLvlEvent, f) => {
            let fs = listeners.get(name).get(highLvlEvent);
            let index = fs.indexOf(f);
            if(index>=0) fs.splice(0,1);

            checkStopReactingTo(name, translateEvent(highLvlEvent));
        }
    }

    function makeSureReactingTo(name, lowLvlEvent) {
        if(internalTriggers.get(name).has(lowLvlEvent)) return;
        let f = reactTo.bind(this, name, lowLvlEvent);
        internalTriggers.set(name, new Map([[lowLvlEvent, f]]));
        bps.get(name).on(lowLvlEvent, f);
    }

    function checkStopReactingTo(name, lowLvlEvent) {
        let f = reactTo.bind(this, name, lowLvlEvent);
        internalTriggers.set(name, new Map([[lowLvlEvent, f]]));
        bps.get(name).on(lowLvlEvent, f);
    }

    function reactTo(name, lowLvlEvent) {
        console.log('reacting!', name, lowLvlEvent);
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

    function translateEvent(event, lowToHigh) {
        if(lowToHigh) {
            if(event == "enter") {
                return ["enter", "enterNext"];
            } else {
                return ["leave", "leaveNext"];
            }
        } else {
            switch(highLvlEvent) {
                case "enter":
                case "enterNext":
                    return "enter";
                case "leave":
                case "leaveNext":
                    return "leave";
            }
        }
    }    
}