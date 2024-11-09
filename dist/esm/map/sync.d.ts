import { OptionOSM } from "./option";
import Map from 'ol/Map';
export type position = {
    zoom: number;
    center: number[];
    rotation: number;
};
export declare function GetPosition(option: OptionOSM): position;
export declare function SyncUrl(map: Map, option: OptionOSM): () => void;
export declare function getCookie(name: string): string | undefined;
