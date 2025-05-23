import React from "react";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source.js";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {defaults as defaultInteractions, Draw, Modify, Select} from "ol/interaction.js";
import {click, platformModifierKeyOnly} from 'ol/events/condition';
import View from "ol/View.js";
import {v4 as uuid} from 'uuid'
import Map from 'ol/Map';
import {DoubleClickZoom, DragBox} from "ol/interaction";
import {Drag} from "./Drag";
import {Collection, Feature, MapBrowserEvent} from "ol";
import {Geometry, SimpleGeometry} from "ol/geom";

import {OptionOSM} from "./option";
import VectorLayer from "ol/layer/Vector";
import {StyleOsm} from "./styleOsm";
import {GetPosition} from "./startPositions";
import * as extent from "ol/extent";
//import {SyncUrl} from "./sync";
import {MapEventCreated, MapEventEditing} from "./mapEventEditing";
import {SyncUrl2} from "./syncNew";


export type PropsBsrMap = {
    /**
     * options map
     */
    option?: OptionOSM | undefined

    /**
     * GeoJson as string
     */
    featuresAsJson?: string | undefined

    /**
     * Array features
     */
    features?: Feature<Geometry>[] | undefined

    /**
     * diw attribute id, used to form the name of the cookie
     */
    id?: string | undefined

    /**
     *diw style.
     */
    style?: React.CSSProperties | undefined,

    /**
     * Class name attribute diw map
     */
    className?: string | undefined
}


export class BsrMap extends React.Component<PropsBsrMap, any> {

    private mapEventEntEdit = new MapEventEditing()
    private mapEventCreated = new MapEventCreated()

    private editFeature: Feature<Geometry> | undefined
    private isEdit = false;
    private isCreate = false;
    private isDispose = false;
    private refDivMap = React.createRef<HTMLDivElement>()
    private resolvePromise?: () => void
    private option = this.props.option ?? {}
    private id = uuid()
    private styleOsm: StyleOsm = new StyleOsm(this.option)
    private source = new VectorSource({wrapX: false, url: this.option.sourceUrl});
    private vector: VectorLayer = new VectorLayer({
        //format: new GeoJSON(),
        source: this.source,
        style: this.styleOsm.styleFunction
    });

    private modify1?: Modify
    private map?: Map
    private draw?: Draw
    private syncUnmount?: () => void;
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


        this.draw = new Draw({
            source: this.source,
            //@ts-ignored
            type: this.type.description
        });
        this.initMap()


    }

    /**
     * Disposal of a map object
     * @param callback callback function
     */
    Dispose(callback?: () => void) {
        if (!this.isDispose) {
            this.isDispose = true;
            this.map!.getAllLayers().forEach((layer) => {
                layer.getSource()?.dispose();
                layer.dispose();
            });
            this.map!.getView().dispose();
            this.map!.dispose();

            if (this.syncUnmount) {
                this.syncUnmount()
                this.syncUnmount = () => {
                }
            }
            this.mapEventEntEdit.eventMap.clear()
            this.mapEventCreated.eventMap.clear()
            this.refDivMap.current?.parentNode?.removeChild(this.refDivMap.current)
            if (callback) callback()
        }
    }


    private initMap() {
        setTimeout(() => {
            const coordinate = GetPosition(this.option, this.props.id)
            this.map = new Map(
                {

                    interactions: defaultInteractions().extend([new Drag(this, this.option),]),

                    layers: [new TileLayer({
                        source: new OSM(),
                    }), this.vector!],


                    target: this.props.id ?? this.id,
                    view: new View({
                        projection: this.option.projection ?? 'EPSG:3857',
                        center: coordinate.center,
                        rotation: coordinate.rotation,
                        zoom: coordinate.zoom,
                    }),
                })

            //this.map.addControl(new ZoomSlider());

            if (this.option.useSynchronizationUrl) {
                // this.syncUnmount = SyncUrl(this.map, this.option,this.props.id)
                this.syncUnmount = new SyncUrl2(this.map, this.option, this.props.id).Dispose;
            }


            if (this.option.removeDoubleClickZoom) {
                // убрали из дефолта двойной клик
                this.map.getInteractions().getArray().forEach((interaction) => {
                    if (interaction instanceof DoubleClickZoom) {
                        this.map!.removeInteraction(interaction);

                    }
                });
            }
            //const link = new Link();

            if (this.option.onClick) {
                this.map.on("click", (evt: MapBrowserEvent<any>) => {

                    const feature = this.map!.forEachFeatureAtPixel(evt.pixel,
                        function (feature) {
                            return feature;
                        });
                    if (feature) {
                        this.option.onClick!(this, feature as Feature, evt)
                    } else {
                        this.option.onClick!(this, undefined, evt)
                    }
                })

            }

            if (this.option.onShowContextMenu) {
                this.map.getViewport().addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const pxl = this.map!.getEventPixel({clientX: e.clientX, clientY: e.clientY});
                    const feature = this.map!.forEachFeatureAtPixel(pxl,
                        function (feature) {
                            return feature;
                        });
                    this.option.onShowContextMenu!(this, feature as Feature, e);
                });
            }


            if (this.option.useDrawBox) {
                const dragBox = new DragBox({
                    condition: platformModifierKeyOnly,
                    className: "box-123"
                });
                if (this.option.onDrawBoxEnd) {
                    dragBox.on('boxend', () => {

                        const boxExtent: Array<number> = dragBox.getGeometry().getExtent();
                        const boxFeatures = this.source.getFeaturesInExtent(boxExtent)
                        this.option.onDrawBoxEnd!(this, boxFeatures, boxExtent)
                    })
                }


                this.map!.addInteraction(dragBox)
            }

        })

        if (this.props.featuresAsJson) {
            this._addFeatureFromJson(this.props.featuresAsJson);
        }
        if (this.props.features) {

            this.source.addFeatures(this.props.features)
        }


    }

    /**
     * Getting a div that contains a card
     */
    public GetDivMap() {
        return this.refDivMap.current!
    }

    /**
     * Getting the current map projection
     */
    public GetCurrentEPSGProjection() {
        return this.map?.getView().getProjection().getCode();

    }

    /**
     * Canceling a geometry creation operation
     * @param callback callback function
     */
    public CancelCreate(callback?: () => void) {
        this.map!.removeInteraction(this.draw!);
        if (this.resolvePromise) {
            this.resolvePromise()
            this.isCreate = false;
        }
        if (callback) callback()

    }

    /**
     * Rotate the map
     * @param rotation rotation magnitude
     */
    public Rotation(rotation: number) {
        this.map?.getView().setRotation(rotation)
    }


    _addFeatureFromJson(json: string, callback?: () => void) {
        const format = new GeoJSON();
        const features = format.readFeatures(json);
        this.source.addFeatures(features)
        if (callback) callback()
    }

    /**
     * Getting ol.VectorLayer
     */
    public GetVectorLayer(): VectorLayer {
        return this.vector!;
    }

    /**
     * Getting ol.VectorSource
     */
    public GetVectorSource(): VectorSource {
        return this.source;
    }

    /**
     * Getting ol.Map
     */
    public GetMap(): Map {
        return this.map!
    }

    /**
     * Redrawing Feature Styles
     */
    public RefreshStyleFeatures() {

        this.source.getFeatures().forEach((f) => {

            f.setStyle(this.styleOsm.styleFunction)
        })
    }

    /**
     * Overloading option styles is usually required if you have changed styles programmatically.
     */
    public RefreshStyleSettings() {
        this.styleOsm.refreshStyleSettings()
    }

    /**
     * Redrawing feature styles into selected styles
     * @param feature target Feature
     */
    public SelectFeature(feature: Feature) {
        this.RefreshStyleFeatures();
        feature.setStyle(this.styleOsm?.selectStyle())
    }

    /**
     * Redrawing features styles into selected styles
     * @param features target Features
     */
    public SelectFeatures(features: Feature[]) {
        this.RefreshStyleFeatures();
        features.forEach(f => {
            f.setStyle(this.styleOsm?.selectStyle())
        })
    }

    /**
     * Redrawing a card to a new position
     * @param center center map
     * @param zoom zoom map
     * @param rotation rotation map
     */
    public GoTo(center: number[], zoom?: number, rotation?: number) {
        const view = this.map!.getView()
        view.setCenter(center)
        if (zoom) {
            view.setZoom(zoom)
        }
        if (rotation) {
            view.setRotation(rotation)
        }
    }

    /**
     * Getting the current map display coordinates
     */
    public GetMapCoordinate(): { center?: number[], zoom?: number, rotation: number } {
        const view = this.map!.getView()
        return {
            center: view.getCenter(),
            zoom: view.getZoom(),
            rotation: view.getRotation()
        }
    }

    /**
     * Getting the coordinates of a square, displaying a map in a browser, can be obtained as an object or as a json string
     * @param isJson request as json
     */
    public GetBound(isJson?: boolean) {
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

    /**
     * Getting features from a map, you can select the geometry type, when selecting undefined all features are selected
     * @param geometry  'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined
     */
    public GetFeatures(geometry: 'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined) {

        switch (geometry) {
            case undefined: {
                return this.source.getFeatures()

            }
            case 'Point': {
                return this.source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType() === 'Point'
                })
            }
            case 'LineString': {
                return this.source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType() === 'LineString'
                })
            }
            case 'Polygon': {
                return this.source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType() === 'Polygon'
                })
            }
            case 'Circle': {
                return this.source.getFeatures().filter(f => {
                    return f.getGeometry()?.getType() === 'Circle'
                })
            }
        }
    }

    /**
     * Adding Features to a Map
     */
    public AddFeatures(f: Feature[]) {
        this.source.addFeatures(f)
    }

    /**
     * Adding Feature to a Map
     * @param data Feature or GeoJson as string
     */
    public AddFeature(data: Feature | string) {
        if (typeof data === "string") {
            this._addFeatureFromJson(data)
        } else {
            this.AddFeatures([data])
        }

    }

    /**
     * Removing Feature from a Map
     * @param f Feature to be removed
     */
    public DeleteFeature(f: Feature) {
        this.source.removeFeature(f)
    }

    /**
     * Deleting all features from the map
     * @param callback callback function
     */
    public DeleteAllFeatures(callback?: () => void) {
        this.source.clear()
        this.map!.removeInteraction(this.draw!);
        if (this.resolvePromise) {
            this.resolvePromise()
        }
        if (callback) callback()

    }

    /**
     * Getting the center of feature
     */
    public GetCenterFeature(feature: Feature): Array<number> {
        return extent.getCenter(feature.getGeometry()!.getExtent())
    }

    /**
     * Getting Feature Coordinates
     */
    public GetCoordinateFeature(feature: Feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getCoordinates();
        } else {
            return [];
        }
    }

    /**
     * Getting  Feature flat Coordinates
     */
    public GetFlatCoordinateFeature(feature: Feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getFlatCoordinates();
        } else {
            return [];
        }
    }

    /**
     * Getting options from props
     */
    public GetOptions() {
        return this.option
    }


    /**
     * remove last point when creating a feature
     */
    public Undo() {
        this.draw?.removeLastPoint();
    }


    /**
     * Build, create feature
     * @param geometry 'Polygon' | 'LineString' | 'Point' | 'Circle'
     */
    public CreateFeature(geometry: 'Polygon' | 'LineString' | 'Point' | 'Circle') {
        this.CancelCreate();
        this.isCreate = true;
        return new Promise<{
            bsrMap: BsrMap,
            isCancel: boolean,
            feature?: Feature,
            geometry: string
        }>((resolve, reject) => {
            try {
                this.mapEventCreated.eventMap.forEach(v => {
                    v(true, undefined)
                })
                this.map!.removeInteraction(this.selectAltClick);
                this.map!.removeInteraction(this.modify1!);
                this.draw = new Draw({
                    source: this.source,
                    //@ts-ignored
                    type: geometry
                });
                this.resolvePromise = () => {
                    this.mapEventCreated.eventMap.forEach(v => {
                        v(false, undefined)
                    })
                    this.resolvePromise = undefined
                    resolve({
                        bsrMap: this,
                        isCancel: true,
                        feature: undefined,
                        geometry: geometry,
                    })
                }
                this.draw.on('drawend', (e) => {
                    this.resolvePromise = undefined
                    const feature: Feature = e.feature;
                    this.map!.removeInteraction(this.draw!);
                    this.isCreate = false;
                    if (this.option.onDrawEnd) {
                        this.option.onDrawEnd(this, feature)
                    }


                    // this.editOnlyRouteOrPolygon()
                    resolve({
                        bsrMap: this,
                        isCancel: false,
                        feature: feature,
                        geometry: geometry,
                    })
                    setTimeout(() => {
                        this.mapEventCreated.eventMap.forEach(v => {
                            v(false, feature)
                        })
                    })
                });
                this.map!.addInteraction(this.draw!);
            } catch (e) {

                this.isCreate = false;
                reject(e)
                setTimeout(() => {
                    this.mapEventCreated.eventMap.forEach(v => {
                        v(false, undefined)
                    })
                })
            }

        })


    }

    /**
     * start edit feature
     * @param feature Feature<Geometry>
     * @param callback callback function
     */
    public StartEditFeature(feature: Feature<Geometry>, callback?: () => void) {
        this.editFeature = feature;
        this.mapEventEntEdit.eventMap.forEach((s) => {
            s(true, this.editFeature)
        })
        const d: Collection<Feature<Geometry>> = this.selectAltClick.getFeatures();
        if (d.getLength() > 0) {
            this.selectAltClick.getFeatures().clear()
        } else {
            this.selectAltClick.getFeatures().push(feature)
            this.editOnlyRouteOrPolygon()
        }
        this.isEdit = true;
        if (callback) callback()
    }

    /**
     * Get the map state, whether the map is in geometry editing state
     */
    public get IsEdit() {
        return this.isEdit
    }

    /**
     * Get the state of the map, whether the map is in the state of creating geometry
     */
    public get IsCreate() {
        return this.isCreate
    }

    /**
     * Subscribe to feature edit events, returns a key that can be used to unsubscribe
     */
    public AddEvenStateEditingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void) {
        const key = uuid()
        this.mapEventEntEdit.eventMap.set(key, fun)
        return key
    }

    /**
     * Unsubscribing to Feature Editing Events
     * @param key event key
     */
    public RemoveEvenStateEditingFeature(key: string) {
        this.mapEventEntEdit.eventMap.delete(key)
    }

    /**
     * Subscribe to feature creation events, returns a key that can be used to unsubscribe
     */
    public AddEventStateCreatingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void) {
        const key = uuid()
        this.mapEventCreated.eventMap.set(key, fun)
        return key
    }

    /**
     * Unsubscribing to geometry creation events
     * @param key event key
     */
    public RemoveEventStateCreatingFeature(key: string) {
        this.mapEventCreated.eventMap.delete(key)
    }

    /**
     * end of editing feature
     */
    public EndEditFeature(callback?: () => void) {

        this.selectAltClick.getFeatures().clear()
        this.isEdit = false
        this.mapEventEntEdit.eventMap.forEach((s) => {
            s(false, this.editFeature)
        })
        if (callback) {
            callback()
        }
        this.editFeature = undefined
    }

    /**
     * Transforming Feature into  geo json
     */
    public FeatureToJson(f: Feature) {
        const geoJsonGeom = new GeoJSON();
        const featureClone: Feature<Geometry> = f.clone();
        return geoJsonGeom.writeGeometry(featureClone.getGeometry()!);
    }

    /**
     * Transforming Feature into  geo json collection
     */
    public FeaturesToJson(features: Feature<Geometry>[]) {
        const geoJsonGeom = new GeoJSON();
        return geoJsonGeom.writeFeatures(features)
    }

    private editOnlyRouteOrPolygon() {
        this.modify1 = new Modify({
            features: this.selectAltClick.getFeatures()
        });
        if (this.option.onModifyEnd) {
            this.modify1.on('modifyend', (event) => {
                event.features.forEach((feature) => {
                    this.option.onModifyEnd!(this, feature)
                });
            });
        }
        this.map!.addInteraction(this.modify1);
        this.map!.addInteraction(this.selectAltClick);
    }

    /**
     * Redrawing features styles
     */
    public RefreshStyleFeature(feature: Feature) {
        feature.setStyle(this.styleOsm!.styleFunction(feature))
    }


    componentWillUnmount() {
        if(this.isDispose) return
        if (this.syncUnmount) {
            this.syncUnmount()
        }
    }

    componentDidMount() {
        this.mapEventEntEdit.eventMap.clear()
        this.mapEventCreated.eventMap.clear()
    }

    render() {
        return (
            <div ref={this.refDivMap}
                 className={this.props.className ?? 'bsr-map-default'}
                 style={this.props.style}
                 id={this.props.id ?? this.id}>

            </div>
        )

    }

}

