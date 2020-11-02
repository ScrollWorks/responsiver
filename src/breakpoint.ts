export type BREAKPOINT_EVENT = 'enter' | 'leave';

export type BreakpointEventListener = (this: void, event: BREAKPOINT_EVENT, name: string) => void;

export default class Breakpoint {
    #name: string;
    #minWidthMM: MediaQueryList;
    #maxWidthMM: MediaQueryList;
    #eventListeners: {[x in BREAKPOINT_EVENT]: BreakpointEventListener[]} = {
        enter: [],
        leave: [],
    };
    #isActive: boolean;

    constructor({name, min, max = Infinity}:
            {name: string, min: number, max?: number}) {
        this.#name = name;
        this.#minWidthMM = window.matchMedia(`(max-width: ${min}px)`);
        this.#maxWidthMM = window.matchMedia(max == Infinity ? '' : `(max-width: ${max}px)`);
        this.#maxWidthMM.addEventListener('change', () => this.onChange());
        this.#minWidthMM.addEventListener('change', () => this.onChange());
        this.#isActive = this.currentlyActive();
    }

    on(event: BREAKPOINT_EVENT, f: BreakpointEventListener, retrospective = true): void {
        this.#eventListeners[event].push(f);
        if(retrospective && (event === 'enter' && this.#isActive)) {
            f('enter', this.#name);
        }
    }

    off(event: BREAKPOINT_EVENT, f: BreakpointEventListener): void {
        const index = this.#eventListeners[event].indexOf(f);
        if(index>=0) this.#eventListeners[event].splice(index,1);
    }

    private onChange() {
        const wasActive = this.#isActive;
        this.#isActive = this.currentlyActive();
        if(wasActive == this.#isActive) return;
        if(this.#isActive) {
            this.processQueue('enter');
        } else if (wasActive) {
            this.processQueue('leave');
        }
    }

    private currentlyActive() {
        return !this.#minWidthMM.matches && this.#maxWidthMM.matches;
    }

    private processQueue(event: BREAKPOINT_EVENT) {
        [...this.#eventListeners[event]].forEach(f=>{f(event, this.#name);});
    }
}