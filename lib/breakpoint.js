class Breakpoint {
    constructor(name, max) {
        this._name = name;
        this._max = max;
    }

    static sort(bp1, bp2) {
        return bp2._max - bp1._max;
    }
}

export default Breakpoint;