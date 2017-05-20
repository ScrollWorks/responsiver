import Responder from './../responder.js';

var R = Responder({
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