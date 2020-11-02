import Breakpoint, {
    BREAKPOINT_EVENT,
    BreakpointEventListener
} from './breakpoint';

type EVENT = BREAKPOINT_EVENT | 'enterOnce' | 'leaveOnce';

type EventListeners = {
    [x in EVENT]?: BreakpointEventListener | BreakpointEventListener[]
};

interface BreakpointDescription extends EventListeners {
    name: string,
    max?: number,
}

type ChangeListener = (this: void, name: string) =>void

type EventsAPI = {
    [x in EVENT]: (breakpointName: string, listener: BreakpointEventListener) => void;
}
interface onAPI extends EventsAPI {
    change: (listener: ChangeListener) => void
}
interface API {
    getCurrent: ()=> string,
    on: onAPI
}

const ALL_POSSIBLE_EVENTS: EVENT[] = ['enter', 'leave', 'enterOnce', 'leaveOnce'];

export default (bpDescriptions: BreakpointDescription[]): API => {
    const breakPoints: Record<string, Breakpoint> = {};
    const changeListeners: ChangeListener[] = [];
    let current = '';

    const sorted = bpDescriptions.sort((a,b)=>a.max - b.max);

    sorted.forEach((bpData, i) => {
        const bp = new Breakpoint({
            name: bpData.name,
            max: bpData.max,
            min: i === 0 ? 0 : sorted[i-1].max
        });
        
        ALL_POSSIBLE_EVENTS
            .filter((eventName: EVENT) => bpData[eventName])
            .forEach(eventName => {
                const listenersForThisBpAndEvent = Array.isArray(bpData[eventName]) ?
                    bpData[eventName] as BreakpointEventListener[] :
                    [bpData[eventName] as BreakpointEventListener];

                listenersForThisBpAndEvent.forEach(listener =>
                    addListenerToBreakpoint(eventName, listener, bp));
            });

        bp.on('enter', () => {
            current = bpData.name;
            changeListeners.forEach(l => l(current));
        });
        breakPoints[bpData.name] = bp;
    });

    function addListenerToBreakpoint(
        event: EVENT,
        listener: BreakpointEventListener,
        breakpoint: Breakpoint): void
    {
        if (event.indexOf('Once') > -1 ) {
            const regularEvent = event.replace('Once', '') as BREAKPOINT_EVENT;
            const listenerThatRemovesItself: BreakpointEventListener = (event, name) => {
                breakpoint.off(regularEvent, listenerThatRemovesItself);
                listener(event, name);
            }
            breakpoint.on(regularEvent, listenerThatRemovesItself);
        } else {
            breakpoint.on(event as BREAKPOINT_EVENT, listener);
        }
    }

    function findBreakpoint(breakpointName: string) {
        const bp = breakPoints[breakpointName];
        if (!bp) {
            throw new Error(`Breakpoint named '${breakpointName}' doesn't exist. \
                Existing breakpoints are: ${breakPoints.keys}`);
        }
        return bp;
    }

    function createAPIMethodForEvent(event: EVENT) {
        return (breakpointName: string, listener: BreakpointEventListener) => {
            const bp = findBreakpoint(breakpointName);
            addListenerToBreakpoint(event, listener, bp);
        }    
    }
    
    return {
        getCurrent: ()=> current,
        on: {
            change: (listener: ChangeListener) => { changeListeners.push(listener) },
            enter: createAPIMethodForEvent('enter'),
            enterOnce: createAPIMethodForEvent('enterOnce'),
            leave: createAPIMethodForEvent('leave'),
            leaveOnce: createAPIMethodForEvent('leaveOnce'),
        }
    }
}


