import { OptionOSM } from "./option";
export type position = {
    zoom: number;
    center: number[];
    rotation: number;
};
export declare function parse(hash: string | undefined): position | undefined;
export declare function GetPosition(option: OptionOSM, id?: string): position;
export declare function setCookie(name: string, value: string): void;
export declare function getCookie(name: string): string | undefined;
