let next = "Next";
let leave = "leave";
let enter = "enter";

export default {
    next: next,
    leave: leave,
    enter: enter,
    toHigh: (e) => {
        if(e == enter) return [
            enter + next,
            enter 
        ]; 
        if(e == leave) return [
            leave + next,
            leave
        ];
    },
    toLow: (e) => {
        switch(e) {
            case enter:
            case enter + next:
                return enter;
            case leave:
            case leave + next:
                return leave;
        }
    }
}