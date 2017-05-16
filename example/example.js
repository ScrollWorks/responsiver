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

R.on('tresci', 'enter', ()=>{
    console.log('entering trescientos from outside');
});
R.on('tresci', 'enterNext', ()=>{
    console.log('entering trescientos once :D');
});