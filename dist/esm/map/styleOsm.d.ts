export class StyleOsm {
    constructor(option: any);
    option: any;
    styles: {
        LineString: Style;
        Polygon: Style;
        Circle: Style;
        Point: Style;
    };
    stylesSelect: Style;
    styleFunction: (feature: any) => any;
    selectStyle: () => Style;
    hexToRgbAEx(color: any): string;
}
import { Style } from "ol/style";
