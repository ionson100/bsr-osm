import {
    Pointer as PointerInteraction
} from 'ol/interaction.js';
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {styleFunction} from "./myStyle";
//import {MyInvokeII} from "../hub/mainHub";
//import {DialogErrorFunc} from "../dialogs/DialogInfo";

function handleDownEvent(evt) {
    if(evt.activePointers[0]?.altKey!==true){
        return null;
    }
    const map = evt.map;
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        if(feature.get('draw')!==true){
            return null;
        }
        if(feature.getGeometry().getType()!=='Polygon'){
            return null;
        }
        const typeFree=feature.get('typeFree');
        if(typeFree===true) return null;
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
}

function handleDragEvent(evt) {

    const deltaX = evt.coordinate[0] - this.coordinate_[0];
    const deltaY = evt.coordinate[1] - this.coordinate_[1];

    const geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
    this.drag_=1;

}

function handleUpEvent() {
    if(this.drag_){
        const typeFree=this.feature_.get('typeFree')// объект для простого показа
        const type=this.feature_.getGeometry().getType()// тип объекта
        const id=this.feature_.get('osm_id')// id объекта
        if(type==='Polygon'&&typeFree===false&&id){
            const geoJsonGeom = new GeoJSON();
            const json = geoJsonGeom.writeGeometry(this.feature_.getGeometry());
            // MyInvokeII("UpdateGeoPolygon",id, json,(r)=>{
            //     if (r !== 1) {
            //        // DialogErrorFunc("Failed saving to database")
            //     }
            // })

        }

    }
    this.drag_=null;
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
}
function handleMoveEvent(evt) {
    if (this.cursor_) {
        const map = evt.map;
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        const element = evt.map.getTargetElement();
        if (feature) {
            const type=feature.getGeometry().getType();
            const typeFree=feature.get('typeFree');
            if(type!=='Polygon'||typeFree===false) return


            if (element.style.cursor !== this.cursor_) {
                this.previousCursor_ = element.style.cursor;
                element.style.cursor = this.cursor_;
            }
        } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
        }
    }
}

export class Drag extends PointerInteraction {
    constructor() {
        super({
            handleDownEvent: handleDownEvent,
            handleDragEvent: handleDragEvent,
            handleMoveEvent: handleMoveEvent,
            handleUpEvent: handleUpEvent,
        });

        /**
         * @type {import("../src/ol/coordinate.js").Coordinate}
         * @private
         */
        this.coordinate_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.cursor_ = 'pointer';

        this.feature_ = null;

        this.drag_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.previousCursor_ = undefined;
    }
}

export const source = new VectorSource({wrapX: false});
export const vector = new VectorLayer({
    format: new GeoJSON(),
    source,
    style: styleFunction
});

