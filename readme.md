ResJS is a library that helps in managing different window widths and changes in between them.

# Usage

## Constructor
It receives a `BreakPointsDesc` object and returns an instance of ResJS.
```
const R = ResJs({
    "mil": 1000, 
    "infinity": Infinity
    });
```

## getCurrent(): BreakPointName(string)
Returns the name of the breakpoint that matches the current window size.

## on(bpName: string, event: EventName(string), f: function)
When the `event` takes places on the `bpName` breakpoint, the function `f` will be called.

## off(bpName: string, event: EventName(string), f: function)
Stops the function `f` from being called when the `event` takes places on the `bpName` breakpoint.

# Types

## `BreakPointsDesc`
Object that needs to be passed to the constructor specifying the different breakpoints we want to handle.
The keys are the names of the breakpoints, and the values are the maximum width in pixels for each. 
```{
    "mil": 1000, 
    "infinity": Infinity
    }, 
```

## `EventName`
EventName is a string that can only have the following values: `enter`, `enterNext`, `leave`, `leaveNext`.

## `BreakPointName`
String. It's value will always be the name of one of the properties in the object with the breakpoints passed to the constructor.

#Sample
```
var R = ResJs({
    "cien": 100, 
    "Mnueveci": 1900, 
    "dosci": 200, 
    "tresci": 300, 
    "Mdosci": 1200, 
    "quini": 500, 
    "seisci": 600, 
    "ochoci": 800, 
    "Mci": 1100, 
    "nueveci": 900, 
    "mil": 1000, 
    "Mtresci": 1300, 
    "desktop": Infinity,
    "Mquini": 1500, 
    "Mcuatroci": 1400, 
    "Mseisci": 1600, 
    "sieteci": 700, 
    "Msieteci": 1700, 
    "Mochoci": 1800, 
    "cuatroci": 400 
});
var f1 =  ()=>{
    console.log('entering f1');
};
var f2 =  ()=>{
    console.log('entering f2');
};
var f3 =  ()=>{
    console.log('entering f3');
    R.off('tresci', 'enter', f1);    
    R.off('mil', 'enter', f3);
};
R.on('tresci', 'enter', f1);
R.on('tresci', 'enter', f2);
R.on('tresci', 'enter', f3);
R.on('mil', 'enter', f3);
R.on('tresci', 'enterNext', ()=>{
    console.log('entering trescientos once :D');
});

```