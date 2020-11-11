import responsiverFactory from '@scrollworks/responsiver';

const log = text => document.getElementById('log').innerHTML+=`<li>${text}</li>`;

// INSTANCIATE RESPONSIVER, OPTIONALLY PASS LISTENERS
const responsiver = responsiverFactory([{
    name: 'from_0_To_400',
    max: 400,
    enter: () => log('logged everytime window becomes <400px'),
    enterOnce: () => log('logged ONCE when window becomes <400px'),
    leave: () => log('logged everytime window becomes >400px after being <400px')
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
    log(`ENTER 400-700 event: ${event}, breakpoint: ${name}`);
});
responsiver.on.leave('from_700_to_800', () => {
    log('Added dynamically for LEAVING 700-800');
});
responsiver.on.leave('from_700_to_800', () => {
    log('Added dynamically (2) for LEAVING 700-800');
});

// SHOW CURRENT BREAKPOINT AT THE TOP RIGHT
document.getElementById('current').innerHTML = responsiver.getCurrent();
responsiver.on.change((breakpointName) => {
    document.getElementById('current').innerHTML = breakpointName;
});