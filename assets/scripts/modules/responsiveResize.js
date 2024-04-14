// see desmos graph for responsive resizing calculations
// https://www.desmos.com/calculator/6xkhrfgl4c
import { ms } from '../main.js';

export const detectWindowSize = () => {
    ms.window.W     = window.innerWidth;
    ms.window.H     = window.innerHeight;
};

export const calculateDimensions = () => {
    calculateFloorSize();
}
const calculateFloorSize = () => {    
    ms.floor.W = Math.round((375    * window.innerHeight ) / 162 )
    ms.floor.H = Math.round((3      * window.innerHeight ) / 2   );
    ms.floor.padding =  {
        h: Math.floor(Math.abs(window.innerHeight   - ms.floor.H ) / 2 ),
        v: Math.floor(Math.abs(window.innerWidth   - ms.floor.W ) / 2 ),
    };
}