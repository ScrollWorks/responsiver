import Breakpoint from './lib/breakpoint.js';

const ENTER = 'enter';
const ENTERNEXT = 'enterNext';
const LEAVE = 'leave';
const LEAVENEXT = 'leaveNext';

export default (bpDescriptions) => {
    const breakPoints = new Map();
    const changeListeners = [];
    let current = '';

    let sorted = bpDescriptions.sort((a,b)=>a.max - b.max);

    sorted.forEach((bpData, i) => {
        let bp = new Breakpoint({
            name: bpData.name || `${bpData.max}`,
            max: bpData.max,
            min: i === 0 ? 0 : sorted[i-1].max
        });

        [ENTER, LEAVE, ENTERNEXT, LEAVENEXT]
            .filter(e => bpData[e])
            .map(e => ({
                e,
                callbacks: Array.isArray(bpData[e]) ? bpData[e] : [bpData[e]]
            }))
            .map(x => x.callbacks.map(cb => ({ event: x.e, cb})))
            .flat()
            .map(processEventAndCallbackPair(bp))
            .forEach(x => bp.on(x.event, x.cb));

        bp.on(ENTER, () => {
            current = bpData.name;
            changeListeners.forEach(l => l(current));
        });
        breakPoints.set(bpData.name, bp);
    });

    return {
        getCurrent: ()=>{
            return current;
        },
        when: generateWhenAPI(breakPoints, changeListeners, () => current)
    }
}

// If it's a "xxxxNext" event listener, update function to remove itself after running
const processEventAndCallbackPair = bp => pair => {
    if (pair.event.indexOf('Next') > -1) {
        const newEvent = pair.event.replace('Next', '');
        const newFunction = () => {
            bp.off(newEvent, newFunction);
            pair.cb();
        }
        return {
            event: newEvent, 
            cb: newFunction
        };
    }
    return pair;
}

const generateWhenAPI  = (breakPoints, changeListeners, getCurrent) => {
    const whenAPI = [ENTER, LEAVE, ENTERNEXT, LEAVENEXT].reduce((prev, event) => {
        prev[event] = [...breakPoints].reduce((prev, [bpName, bp]) => {
            prev[bpName] = cb => {
                const newPair = processEventAndCallbackPair(bp)({event, cb});
                bp.on(newPair.event, newPair.cb);
            };
            return prev;
        }, {});
        return prev;
    }, {});
    whenAPI.change = cb => {
        changeListeners.push(cb);
        cb(getCurrent());
    };
    return whenAPI;
}