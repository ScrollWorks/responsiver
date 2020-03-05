import responsiverFactory from '../index.js';

// Pass breakpoints on instantiation, optionally, also pass listeners.
const Responsiver = responsiverFactory([{
    name: 'under1Thousand',
    max: 1000,
    enter: () => console.log('logged everytime window becomes narrower than 1000px'),
    enterNext: () => console.log('logged FIRST time window becomes narrower than 1000px'),
    leave: () => console.log('logged everytime window becomes wider than 1000px, after having been narrower'),
    leaveNext: () => console.log('logged FIRST time window becomes wider than 1000px, after having been narrower'),
},{
    name: 'under2Thousand',
    max: 2000 // the only required field for a breakpoint is "max", needs to be an integer.
}]);

// Triggered everytime the breakpoint changes.
Responsiver.when.change(currentBreakPoint => console.log(`Breakpoint changed to ${currentBreakPoint}`));

// Listeners can be added dynamically to breakpoints after instanciation.
Responsiver.when.enter.under2Thousand(() => console.log('logged every time we enter the under2Thousand breakpoint'));

// Current breakpoint can be obtained at any time by calling get Current
console.log('current breakpoint is', Responsiver.getCurrent());