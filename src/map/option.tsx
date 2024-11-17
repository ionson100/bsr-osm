
import {Feature, MapBrowserEvent} from "ol";
import {Geometry} from "ol/geom";
import {BsrMap} from "./mapCore";

export type OptionOSM = {
    /**
     * Map zoom
     */
    zoom?: number;
    /**
     * map center:[latitude,longitude] ([x,y])
     */
    center?: Array<number>

    /**
     * Rotation map
     */
    rotation?:number

    /**
     * Disable double click on the map
     */
    removeDoubleClickZoom?: boolean

    /**
     * Map click event
     */
    onClick?: (map:BsrMap,feature: Feature | undefined,evt: MapBrowserEvent<any>) => void

    /**
     * Context menu call events
     */
    onShowContextMenu?:(map:BsrMap,feature: Feature<Geometry> | undefined,e: MouseEvent)=>void

    /**
     * Feature Edit End Events
     */
    onModifyEnd?:(map:BsrMap,feature: Feature<Geometry>)=>void

    /**
     * Events for finishing the creation of new Feature
     */
    onDrawEnd?:(map:BsrMap,feature:Feature)=>void

    /**
     * Feature drag end events on the map, (Ctrl -> mouse drag feature)
     */
    onDragEnd?:(map:BsrMap, feature:Feature)=>void

    /**
     * Events of the end of selection of a rectangular area on the map, used if useDrawBox = true
     * (Shift+Ctrl -> Drawing an area with a mouse)
     * @param features Feature that fell into the selected area
     */
    onDrawBoxEnd?:(map:BsrMap, features:Feature<Geometry>[],extend:Array<number>)=>void

    /**
     * Allows you to draw a rectangular area on the map
     */
    useDrawBox?:boolean

    /**
     * Features styles.
     */
    style?:StyleSettings

    /**
     * Allows inserting map parameters into URL hash, the last data is written into cookies (cookies name 'bsr-12'+ id
     */
    useSynchronizationUrl?:boolean

    /**
     * URL source for loading geo json when starting the map
     */
    sourceUrl?:string

    /**
     * map projection. default:'EPSG:4326'
     */
    projection?: 'EPSG:4326'|'EPSG:3857'|string|undefined,


}
export type StyleSettings ={
    /**
     * Line color LineString
     */
    colorLineString?:string

    /**
     * Line width
     */
    widthLineString?:number

    /**
     * Polygon border color
     */
    colorPolygon?:string

    /**
     * Polygon border width
     */
    widthPolygon?:number;

    /**
     * Polygon fill color
     */
    fillPolygon?:string

    colorLineSelect?:string
    widthLineSelect?:number
    fillBodySelect?:string

    colorCircle?:string
    fillCircle?:string
    widthCircle?:number

    colorPoint?:string
    radiusPoint?:number
}
