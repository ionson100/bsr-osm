export class StyleOsm {
    constructor(option: any);
    option: any;
    styles: {};
    stylesSelect: Style;
    refreshStyleSettings(): void;
    styleFunction: (feature: any) => any;
    selectStyle: () => Style;
    hexToRgbAEx(color: any): string;
}
import { Style } from "ol/style";
