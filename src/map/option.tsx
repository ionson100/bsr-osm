
import {Feature, MapBrowserEvent} from "ol";
import {Geometry} from "ol/geom";
import {BsrMap} from "./mapCore";

export type OptionOSM = {
    zoom?: number;
    /**
     * [latitude,longitude] ([x,y])
     */
    center?: Array<number>
    rotation?:number
    removeDoubleClickZoom?: boolean
    onClick?: (map:BsrMap,feature: Feature | undefined,evt: MapBrowserEvent<any>) => void
    onShowContextMenu?:(map:BsrMap,feature: Feature<Geometry> | undefined,e: MouseEvent)=>void
    onModifyEnd?:(map:BsrMap,feature: Feature<Geometry>,json:string)=>void
    onDrawEnd?:(map:BsrMap,feature:Feature,json:string)=>void
    onDragEnd?:(map:BsrMap, feature:Feature, json:string)=>void
    onDrawBoxEnd?:(map:BsrMap, features:Feature<Geometry>[],extend:Array<number>)=>void
    useDrawBox?:boolean
    style?:StyleSettings
    useSynchronizationUrl?:boolean

    sourceUrl?:string
    projection?: 'EPSG:4326'|'EPSG:3857'|string|undefined,


}
export type StyleSettings ={
    colorLineString?:string
    widthLineString?:number

    colorPolygon?:string
    widthPolygon?:number;
    fillPolygon?:string

    colorPolygonSelect?:string
    widthPolygonSelect?:number
    fillPolygonSelect?:string

    colorCircle?:string
    fillCircle?:string
    widthCircle?:number

    colorPoint?:string
    radiusPoint?:number
}
