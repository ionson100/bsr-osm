import {Feature} from "ol";
import {Geometry} from "ol/geom";

export class MapEvent{
    public eventFinishEditFeature=new Map<string,(f?:Feature<Geometry>)=>void>()
}