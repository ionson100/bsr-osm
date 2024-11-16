import { Feature } from "ol";
import { Geometry } from "ol/geom";
export declare class MapEventEditing {
    eventMap: Map<string, (stateStart: boolean, f?: Feature<Geometry>) => void>;
}
export declare class MapEventCreated {
    eventMap: Map<string, (stateStart: boolean, f?: Feature<Geometry>) => void>;
}
