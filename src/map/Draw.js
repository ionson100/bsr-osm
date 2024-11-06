import {Draw} from "ol/interaction.js";

const typles = Object.freeze({
    NONE: Symbol('None'),
    POLYGON: Symbol('Polygon'),
    LINE: Symbol('LineString')
});

let type = typles.POLYGON;

 export function getDraw(source){
    return  new Draw({
         source,
         type: type.description
     });
}