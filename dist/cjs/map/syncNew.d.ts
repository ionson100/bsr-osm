import { OptionOSM } from "./option";
import Map from "ol/Map";
export declare class SyncUrl2 {
    private map;
    private option;
    id?: string;
    constructor(map: Map, option: OptionOSM, id?: string);
    popState: () => void;
    getHashCore: (hashMap: string) => string;
    updatePermalink: () => void;
    pp23: (event: PopStateEvent) => void;
    Dispose: () => void;
}
