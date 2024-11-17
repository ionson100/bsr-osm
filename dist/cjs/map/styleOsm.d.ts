export class StyleOsm {
    constructor(option: any);
    option: any;
    styles: {};
    stylesSelect: Style | undefined;
    refreshStyleSettings(): void;
    styleFunction: (feature: any) => any;
    selectStyle: () => Style | undefined;
    hexToRgbAEx(color: any): string;
}
import { Style } from "ol/style";
