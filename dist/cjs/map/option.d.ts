import { Feature, MapBrowserEvent } from "ol";
import { Geometry } from "ol/geom";
import { BsrMap } from "./mapCore";
export type OptionOSM = {
    /**
     * Map zoom
     */
    zoom?: number;
    /**
     * map center:[latitude,longitude] ([x,y])
     */
    center?: Array<number>;
    /**
     * Rotation map
     */
    rotation?: number;
    /**
     * Disable double click on the map
     */
    removeDoubleClickZoom?: boolean;
    /**
     * Map click event
     */
    onClick?: (map: BsrMap, feature: Feature | undefined, evt: MapBrowserEvent<any>) => void;
    /**
     * Context menu call events
     */
    onShowContextMenu?: (map: BsrMap, feature: Feature<Geometry> | undefined, e: MouseEvent) => void;
    /**
     * Feature Edit End Events
     */
    onModifyEnd?: (map: BsrMap, feature: Feature<Geometry>) => void;
    /**
     * Events for finishing the creation of new Feature
     */
    onDrawEnd?: (map: BsrMap, feature: Feature) => void;
    /**
     * Feature drag end events on the map, (Ctrl+Shift -> mouse drag feature)
     */
    onDragEnd?: (map: BsrMap, feature: Feature) => void;
    /**
     * Events of the end of selection of a rectangular area on the map, used if useDrawBox = true
     * (Ctrl -> Drawing an area with a mouse)
     * @param features Feature that fell into the selected area
     */
    onDrawBoxEnd?: (map: BsrMap, features: Feature<Geometry>[], extend: Array<number>) => void;
    /**
     * Allows you to draw a rectangular area on the map. (Ctrl -> Drawing an area with a mouse)
     */
    useDrawBox?: boolean;
    /**
     * Features styles.
     */
    style?: StyleSettings;
    /**
     * Allows inserting map parameters into URL hash, the last data is written into cookies (cookies name 'bsr-12'+ id
     */
    useSynchronizationUrl?: boolean;
    /**
     * URL source for loading geo json when starting the map
     */
    sourceUrl?: string;
    /**
     * map projection. default:'EPSG:4326'
     */
    projection?: 'EPSG:4326' | 'EPSG:3857' | string | undefined;
};
export type StyleSettings = {
    /**
     * Line color LineString. default: '#179a1c'
     */
    colorLineString?: string;
    /**
     * Line width. default:4
     */
    widthLineString?: number;
    /**
     * Polygon border color. default:'#07720d'
     */
    colorPolygon?: string;
    /**
     * Polygon border width. default:3
     */
    widthPolygon?: number;
    /**
     * Polygon fill color. default:'#F8F9F4'
     */
    fillPolygon?: string;
    /**
     * select Line color LineString and Circle. default:'#f80622'
     */
    colorLineSelect?: string;
    /**
     * Select Line width LineString and Circle. default:3
     */
    widthLineSelect?: number;
    /**
     * Polygon, Circle fill color. default:'#F8F9F4'
     */
    fillBodySelect?: string;
    /**
     * Select Point color. default:'#b91818'
     */
    colorPointSelect?: string;
    /**
     * Select Radius Point: default:6
     */
    radiusPointSelect?: number;
    /**
     * Circle color. default:'#24f22e'
     */
    colorCircle?: string;
    /**
     * Circle fill color. default:'#dd2e2e'
     */
    fillCircle?: string;
    /**
     * Circle border width. default:5
     */
    widthCircle?: number;
    /**
     * Point color. default:'#0324fb'
     */
    colorPoint?: string;
    /**
     * Point radius. default:5
     */
    radiusPoint?: number;
};
