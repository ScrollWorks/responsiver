class Breakpoint {
    constructor(name, min, max) {
        this._name = name;
        this._prevMM = window.matchMedia(`(max-width: ${min}px)`);
        this._currentMM = (max == Infinity ? mockedMM : window.matchMedia(`(max-width: ${max}px)`));
        this._queues = {
            enter: [],
            leave: []
        }

        let onChangeF = onChange.bind(this);
        this._currentMM.addListener(onChangeF);
        this._prevMM.addListener(onChangeF);

        this._isActive = currentlyActive.call(this);
    }

    on(event, f, retrospective) {
        this._queues[event].push(f);
        if(retrospective && ((event == "enter" && this._isActive) || (event == "leave" && !this._isActive)))
            f.call();
    }

    off(event, f) {
        var fs = this._queues[event];
        let index = fs.indexOf(f);
        if(index>=0) fs.splice(index,1);
    }
}

function currentlyActive() {
    return !this._prevMM.matches && this._currentMM.matches;
}

function onChange() {
    let wasActive = this._isActive;
    this._isActive = currentlyActive.call(this);
    if(wasActive == this._isActive) return;
    if(this._isActive) {
        processQueue.call(this, "enter");
    } else if (wasActive) {
        processQueue.call(this, "leave");
    }
}

function processQueue(event) {
    this._queues[event].forEach((f)=>{f.call();});
}

const mockedMM = {
    matches: true,
    addListener: ()=>{}
}

export default Breakpoint;