import {FeatureLike} from "ol/Feature";
import {Feature} from "ol";
import {Geometry} from "ol/geom";

export type OptionOSM = {
    zoom?: number;
    /**
     * [latitude,longitude] ([x,y])
     */
    center?: Array<number>
    removeDoubleClickZoom?: boolean
    onClick?: (f: FeatureLike | undefined) => void
    onShowContextMenu?:(f: FeatureLike | undefined,e: MouseEvent)=>void
    onModifyEnd?:(f: Feature<Geometry>,json:string)=>void
    onDrawEnd?:(f:Feature,json:string)=>void
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