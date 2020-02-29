const mockedMM = {
    matches: true,
    addListener: ()=>{}
}
export default class Breakpoint {
    constructor({name, min, max}) {
        this._name = name;
        this._prevMM = window.matchMedia(`(max-width: ${min}px)`);
        this._currentMM = (max == Infinity ? mockedMM : window.matchMedia(`(max-width: ${max}px)`));
        this._eventListeners = {
            enter: [],
            leave: []
        };
        let onChangeF = onChange.bind(this);
        this._currentMM.addListener(onChangeF);
        this._prevMM.addListener(onChangeF);

        this._isActive = currentlyActive(this);
    }

    on(event, f, retrospective = true) {
        this._eventListeners[event].push(f);
        // console.log(this);
        if(retrospective && (event == "enter" && this._isActive))
            f.call();
    }

    off(event, f) {
        let index = this._eventListeners[event].indexOf(f);
        if(index>=0) this._eventListeners[event].splice(index,1);
    }
}

function currentlyActive(bp) {
    return !bp._prevMM.matches && bp._currentMM.matches;
}

function onChange() {
    let wasActive = this._isActive;
    this._isActive = currentlyActive(this);
    if(wasActive == this._isActive) return;
    if(this._isActive) {
        processQueue.call(this, "enter");
    } else if (wasActive) {
        processQueue.call(this, "leave");
    }
}

function processQueue(event) {
    [...this._eventListeners[event]].forEach((f)=>{f.call();});
}
