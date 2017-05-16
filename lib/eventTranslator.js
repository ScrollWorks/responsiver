export default {
    toHigh: (e) => {
        if(e == "enter") return [
            "enter", 
            "enterNext"
        ]; 
        if(e == "leave") return [
            "leave", 
            "leaveNext"
        ];
    },
    toLow: (e) => {
        switch(e) {
            case "enter":
            case "enterNext":
                return "enter";
            case "leave":
            case "leaveNext":
                return "leave";
        }
    }
}