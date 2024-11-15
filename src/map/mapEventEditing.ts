import {Feature} from "ol";
import {Geometry} from "ol/geom";

export class MapEventEditing {
    public eventMap=new Map<string,(stateStart:boolean,f?:Feature<Geometry>)=>void>()
}
export class MapEventCreated {
    public eventMap=new Map<string,(stateStart:boolean, f?:Feature<Geometry>)=>void>()
}