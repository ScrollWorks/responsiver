export default function(bps) {
    let listeners = new Map();
    return {
        add: (name, event, f)=> {
            if(listeners.has(name)) {
                if(listeners.get(name).has(event)) {
                    listeners.get(name).get(event).push(f);
                } else {
                    listeners.get(name).set(event, [f]);
                }
            } else {
                listeners.set(name, new Map([[event, f]]));
            }
        }
    }
}