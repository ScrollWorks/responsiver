# Responsiver
A frontend library that allows you to easily (and efficiently, no listening for resize events etc.) respond to changes in the viewport's width.

## **Usage**

### **Example**

Complete, runnable example in [here](https://github.com/ScrollWorks/sws-responsiver/tree/master/example/index.ts)

```
import responsiverFactory from '@scrollworks/responsiver';

// INSTANCIATE RESPONSIVER, OPTIONALLY PASS LISTENERS
const responsiver = responsiverFactory([{
    name: 'from_0_To_400',
    max: 400,
    enter: () => console.log('logged everytime window becomes <400px'),
    enterOnce: () => console.log('logged ONCE when window becomes <400px'),
    leave: () => console.log('logged everytime window becomes >400px after being <400px')
},{
    name: 'from_400_to_700',
    max: 700
}, {
    name: 'from_700_to_800',
    max: 800
}, {
    name: 'biggerThan800'
}]);

// ADD LISTENERS AFTER INSTANCIATION
responsiver.on.enter('from_400_to_700', (event, name) => {
    console.log(`ENTER 400-700 event: ${event}, breakpoint: ${name}`);
});
responsiver.on.leave('from_700_to_800', () => {
    console.log('Added dynamically for LEAVING 700-800');
});
responsiver.on.leave('from_700_to_800', () => {
    console.log('Added dynamically (2) for LEAVING 700-800');
});

// SHOW CURRENT BREAKPOINT AT THE TOP RIGHT
document.getElementById('current').innerHTML = responsiver.getCurrent();
responsiver.on.change((breakpointName) => {
    document.getElementById('current').innerHTML = breakpointName;
});
```

### **Instanciation**
First of all, you'll need to create a new `responsiver` object by calling the factory method returned by the package.

You have to pass to this factory function the different breakpoints that you are going to define in your application. 

Each breakpoint definition is a regular `Object` with the following properties:
- `name` - **REQUIRED** - The name of your breakpoint
- `max` - Maximum number of pixels of your breakpoint.  Optional (left empty on biggest breakpoint).
- `enter`, `enterOnce`, `leave`, `leaveOnce` - Optional event listeners for this breakpoint. More on this later.

This call will return an object, which exposes the following API.

### **API**

- `getCurrent()` - Takes no parameters and returns the name of the current breakpoint.
- `on.enter(breakPointName, callback)`
- `on.leave(breakPointName, callback)`
- `on.enterOnce(breakPointName, callback)`
- `on.leaveOnce(breakPointName, callback)` - This function and the 3 above have the same signature and funcionality.  They take a string, which is the name of the breakpoint, and a function, which will be run 
when as described by the event that names the method. 
**The callback function will be called with two parameters, `event`, and `name`, both strings.**
