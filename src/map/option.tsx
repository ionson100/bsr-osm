import {FeatureLike} from "ol/Feature";
import {Feature} from "ol";
import {Geometry} from "ol/geom";
import {BsrMap} from "./mapCore";

export type OptionOSM = {
    zoom?: number;
    /**
     * [latitude,longitude] ([x,y])
     */
    center?: Array<number>
    removeDoubleClickZoom?: boolean
    onClick?: (map:BsrMap,feature: Feature | undefined) => void
    onShowContextMenu?:(map:BsrMap,feature: Feature<Geometry> | undefined,e: MouseEvent)=>void
    onModifyEnd?:(map:BsrMap,feature: Feature<Geometry>,json:string)=>void
    onDrawEnd?:(map:BsrMap,feature:Feature,json:string)=>void
    onDragEnd?:(map:BsrMap, feature:Feature, json:string)=>void
    onDrawBoxEnd?:(map:BsrMap, features:Feature<Geometry>[],extend:Array<number>)=>void
    useDrawBox?:boolean
    style?:Style


}
export type Style={
    colorRoute:'#179a1c'
    widthRoute:4

    colorPolygon:'#07720d'
    widthPolygon:3;
    fillPolygon:'#F8F9F4'

    colorPolygonSelect:'#f80622'
    widthPolygonSelect:3;
    fillPolygonSelect:'#F8F9F4'
}
 export const defaultStyle:Style={
    colorRoute:'#179a1c',
    widthRoute:4,

    colorPolygon:'#07720d',
    widthPolygon:3,
    fillPolygon:'#F8F9F4',

    colorPolygonSelect:'#f80622',
    widthPolygonSelect:3,
    fillPolygonSelect:'#F8F9F4'
}