import {Pointer as PointerInteraction} from 'ol/interaction.js';
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {styleFunction} from "./myStyle";



function handleDownEvent(evt) {
    const run=evt.activePointers[0]?.shiftKey=== true&&evt.activePointers[0]?.ctrlKey===true
    if (!run) {
        return null;
    }
    const map = evt.map;
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {

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
    this.drag_ = 1;


}

function handleUpEvent() {
    if (this.drag_) {
        const geoJsonGeom = new GeoJSON();
        const json = geoJsonGeom.writeGeometry(this.feature_.getGeometry());
        if (this.option.onDragEnd) {
            this.option.onDragEnd(this.bsrMap, this.feature_, json)
        }
    }
    this.drag_ = null;
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
    constructor(bsrMap, option) {
        super({
            handleDownEvent: handleDownEvent,
            handleDragEvent: handleDragEvent,
            handleMoveEvent: handleMoveEvent,
            handleUpEvent: handleUpEvent,
        });
        this.bsrMap = bsrMap
        this.option = option
        this.coordinate_ = null;
        this.cursor_ = 'pointer';
        this.feature_ = null;
        this.drag_ = null;
        this.previousCursor_ = undefined;
    }
}

export const source = new VectorSource({wrapX: false});
export const vector = new VectorLayer({
    format: new GeoJSON(),
    source,
    style: styleFunction
});

