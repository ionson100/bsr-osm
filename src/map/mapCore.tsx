import React from "react";
import {v4 as uuid} from 'uuid'
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source.js";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {defaults as defaultInteractions, Draw, Modify, Select} from "ol/interaction.js";
import {click, platformModifierKeyOnly} from 'ol/events/condition';
import View from "ol/View.js";

import Map from 'ol/Map';


import {DoubleClickZoom, DragBox} from "ol/interaction";
import {Drag, source, vector} from "./Drag";
import {Collection, Feature, MapBrowserEvent} from "ol";
import {Geometry} from "ol/geom";
import {MyGeometry} from "./utils";

import {mySelectPolygon, styleFunction} from "./myStyle";
import {defaultStyle, OptionOSM} from "./option";
import {Fill, Stroke, Style} from "ol/style";


const raster = new TileLayer({
    source: new OSM()
})
// const typles = Object.freeze({
//     NONE: Symbol('None'),
//     POLYGON: Symbol('Polygon'),
//     LINE: Symbol('LineString'),
//     POINT: Symbol('Point')
// });

//let type = typles.NONE;


/**
 *
 */
export type PropsBsrMap = {
    option: OptionOSM
}

export class BsrMap extends React.Component<PropsBsrMap, any> {
    private source: VectorSource<any> = new VectorSource({wrapX: false});
    private modify1?: Modify
    private id = uuid()
    private map?: Map
    private draw?: Draw

    private selectedStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
        }),
    });


    private typles = Object.freeze({
        NONE: Symbol('None'),
        POLYGON: Symbol('Polygon'),
        LINE: Symbol('LineString'),
        POINT: Symbol('Point'),
        CIRCLE: Symbol('Circle'),
    });
    private selectAltClick = new Select({
        //@ts-ignored
        condition: (mapBrowserEvent) => {

            click(mapBrowserEvent)
        },
        filter: () => false

    });

    private type = this.typles.POINT;

    constructor(props: Readonly<PropsBsrMap>) {
        super(props);

        // this.draw = getDraw(source)
        this.draw = new Draw({
            source,
            //@ts-ignored
            type: this.type.description
        });
        setTimeout(() => {
            if (!this.props.option.style) {
                this.props.option.style = defaultStyle;
            }
        })

    }

    private initMap() {
        setTimeout(() => {
            this.map = new Map(
                {
                    interactions: defaultInteractions().extend([new Drag(this, this.props.option),]),

                    layers: [new TileLayer({
                        source: new OSM(),
                    }), vector],


                    target: 'map',
                    view: new View({
                        center: this.props.option.center ?? [1608429.01, 6461053.51],//[2297310.350254958, 7242755.816153312],
                        zoom: this.props.option.zoom ?? 15,
                    }),
                })


            if (this.props.option.removeDoubleClickZoom) {
                // убрали из дефолта двойной клик
                this.map.getInteractions().getArray().forEach((interaction) => {
                    if (interaction instanceof DoubleClickZoom) {
                        this.map!.removeInteraction(interaction);

                    }
                });
            }
            // sync(this.map);
            if (this.props.option.onClick) {
                this.map.on("click", (evt: MapBrowserEvent<any>) => {

                    const feature = this.map!.forEachFeatureAtPixel(evt.pixel,
                        function (feature) {
                            return feature;
                        });
                    if (feature) {

                        this.props.option.onClick!(this, feature as Feature)
                    }
                })

            }

            if (this.props.option.onShowContextMenu) {
                this.map.getViewport().addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const feature = this.map!.forEachFeatureAtPixel([e.offsetX, e.offsetY],
                        function (feature) {
                            return feature;
                        });
                    this.props.option.onShowContextMenu!(this, feature as Feature, e);
                });
            }


            if (this.props.option.useDrawBox) {
                const dragBox = new DragBox({
                    condition: platformModifierKeyOnly,
                    className: "box"
                });
                if (this.props.option.onDrawBoxEnd) {
                    dragBox.on('boxend', () => {

                        const boxExtent: Array<number> = dragBox.getGeometry().getExtent();
                        const boxFeatures = source.getFeaturesInExtent(boxExtent)
                        this.props.option.onDrawBoxEnd!(this, boxFeatures, boxExtent)
                    })
                }


                this.map!.addInteraction(dragBox)
            }

        })

    }

    public DrawFeatureCollection(json: string) {
        const format = new GeoJSON();
        const features = format.readFeatures(json);
        source.addFeatures(features)
    }


    /**
     * Перерисовка стилей
     */
    public RefreshStyleFeatures() {

        source.getFeatures().map((f) => {
            f.setStyle(styleFunction)
        })
    }

    public SelectStyleFeature(feature: Feature) {

        this.RefreshStyleFeatures();
        feature.setStyle(mySelectPolygon)
    }

    /**
     * получение границ карты в браузере
     * @returns {*}
     */
    public getBound(isJson?: boolean) {
        const extent = this.map!.getView().calculateExtent(this.map!.getSize());
        const bound: { p1?: number[], p2?: number[], p3?: number[], p4?: number[], p5?: number[] } = {};
        bound.p1 = [extent[0], extent[3]]
        bound.p2 = [extent[2], extent[3]]
        bound.p3 = [extent[2], extent[1]]
        bound.p4 = [extent[0], extent[1]]
        bound.p5 = [extent[0], extent[3]]
        if (isJson) {
            return JSON.stringify(bound)
        }
        return bound
    }

    public getFeatures(geo?: MyGeometry) {

        switch (geo) {
            case undefined: {
                return source.getFeatures()
                break
            }
            case MyGeometry.point: {
                return source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType().toString() === 'Point'
                })
            }
            case MyGeometry.line: {
                return source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType().toString() === 'Line'
                })
            }
            case MyGeometry.polygon: {
                return source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType().toString() === 'Polygon'
                })
            }
        }
    }

    public addFeatures(f: Feature[]) {
        source.addFeatures(f)
    }

    public removeFeature(f: Feature) {
        source.removeFeature(f)
    }

    public removeAllFeatures() {
        source.clear()
        this.map!.removeInteraction(this.draw!);
        // InitMenuCurrentRoute(undefined)

    }

    public CreateRoute() {
        this.map!.removeInteraction(this.selectAltClick);

        this.map!.removeInteraction(this.modify1!);
        this.allowDrawFeature(2);
        return true;
    }

    public CreatePolygon() {
        this.map!.removeInteraction(this.selectAltClick);
        this.map!.removeInteraction(this.modify1!);
        this.allowDrawFeature(1);
        return true;
    }
    public CreatePoint() {
        this.map!.removeInteraction(this.selectAltClick);
        this.map!.removeInteraction(this.modify1!);
        this.allowDrawFeature(3);
        return true;
    }
    public CreateCircle() {
        this.map!.removeInteraction(this.selectAltClick);
        this.map!.removeInteraction(this.modify1!);
        this.allowDrawFeature(4);
        return true;
    }

    /**
     * возврат точки при создании маршрута или полигона
     */
    undo() {
        this.draw?.removeLastPoint();
    }


    private allowDrawFeature(index = 0) {
        switch (index) {
            case 1: {
                this.type = this.typles.POLYGON;
                break;
            }
            case 2: {
                this.type = this.typles.LINE;
                break;
            }
            case 3: {
                this.type = this.typles.POINT;
                break;
            }
            case 4: {
                this.type = this.typles.CIRCLE;
                break;
            }
            default: {
                this.type = this.typles.NONE;
            }
        }

        this.draw = new Draw({
            source,
            //@ts-ignored
            type: this.type.description
        });
        this.draw.on('drawend', (e) => {
            const feature: Feature = e.feature;
            this.map!.removeInteraction(this.draw!);
            this.editOnlyRouteOrPolygon()
            if (this.props.option.onDrawEnd) {
                this.props.option.onDrawEnd(this, feature, this.ConvertFeatureToJson(feature))
            }
            setTimeout(() => {
                this.selectAltClick?.getFeatures().clear()
                this.selectAltClick.getFeatures().push(feature)
            }, 500)
        });

        this.map!.addInteraction(this.draw!);


    }

    public StartEditFeature(feature: Feature) {
        const d: Collection<Feature<Geometry>> = this.selectAltClick.getFeatures();
        if (d.getLength() > 0) {
            this.selectAltClick.getFeatures().clear()
        } else {
            this.selectAltClick.getFeatures().push(feature)
        }
    }

    public FinishEditFeature(callback?: () => void) {
        this.selectAltClick.getFeatures().clear()
        if (callback) {
            callback()
        }
    }

    public ConvertFeatureToJson(f: Feature) {
        const geoJsonGeom = new GeoJSON();
        const featureClone: Feature<Geometry> = f.clone();
        return geoJsonGeom.writeGeometry(featureClone.getGeometry()!);
    }

    private editOnlyRouteOrPolygon() {
        this.modify1 = new Modify({
            features: this.selectAltClick.getFeatures()
        });
        if (this.props.option.onModifyEnd) {
            this.modify1.on('modifyend', (event) => {
                event.features.forEach((feature) => {
                    this.props.option.onModifyEnd!(this, feature, this.ConvertFeatureToJson(feature))
                });
            });
        }
        this.map!.addInteraction(this.modify1);
        this.map!.addInteraction(this.selectAltClick);
    }

    /**
     * Перерисовка стилей
     */


    refreshStyleFeaturesPolygon() {
        source.getFeatures().map((f) => {

            f.setStyle(styleFunction)
        })
    }


    componentDidMount() {
        this.initMap()
        // const format = new GeoJSON();
        // const features = format.readFeatures(json);
        // source.addFeatures(features)
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}} id={'map'}></div>
        )

    }

}
