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
import {Geometry,  SimpleGeometry} from "ol/geom";

import {OptionOSM} from "./option";
import VectorLayer from "ol/layer/Vector";
import {StyleOsm} from "./styleOsm";
import {GetPosition} from "./startPositions";
import * as extent from "ol/extent";
//import {SyncUrl} from "./sync";
import {MapEventCreated, MapEventEditing} from "./mapEventEditing";
import {SyncUrl2} from "./syncNew";





export type PropsBsrMap = {
    option?: OptionOSM|undefined
    featuresAsJson?: string|undefined
    features?: Feature<Geometry>[]|undefined
    id?: string|undefined
    style?: React.CSSProperties | undefined,
}


export class BsrMap extends React.Component<PropsBsrMap, any> {

    private mapEventEntEdit=new MapEventEditing()
    private mapEventCreated=new MapEventCreated()

    private editFeature:Feature<Geometry>|undefined
    private isEdit=false;
    private isCreate=false;
    private isDispose=false;
    private refDivMap=React.createRef<HTMLDivElement>()
    private resolvePromise?: () => void
    private option = this.props.option ?? {}
    private id = uuid()
    private styleOsm: StyleOsm = new StyleOsm(this.option)
    private source = new VectorSource({wrapX: false,url:this.option.sourceUrl});
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
    Dispose(callback?:()=>void){
        if(!this.isDispose){
            this.map!.getAllLayers().forEach((layer) => {
                layer.getSource()?.dispose();
                layer.dispose();
            });
            this.map!.getView().dispose();
            this.map!.dispose();
            this.isDispose=true;
            if(this.syncUnmount){
                this.syncUnmount()
                this.syncUnmount=()=>{}
            }
            this.mapEventEntEdit.eventMap.clear()
            this.mapEventCreated.eventMap.clear()
            if(callback) callback()
        }
    }



    private initMap() {
        setTimeout(() => {
            const coordinate = GetPosition(this.option,this.props.id)
            this.map = new Map(
                {

                    interactions: defaultInteractions().extend([new Drag(this, this.option),]),

                    layers: [new TileLayer({
                        source: new OSM(),
                    }), this.vector!],


                    target: this.props.id ?? this.id,
                    view: new View({
                        projection: this.option.projection??'EPSG:3857',
                        center: coordinate.center,
                        rotation: coordinate.rotation,
                        zoom: coordinate.zoom,
                    }),
                })

            //this.map.addControl(new ZoomSlider());

            if(this.option.useSynchronizationUrl){
               // this.syncUnmount = SyncUrl(this.map, this.option,this.props.id)
                this.syncUnmount=new SyncUrl2(this.map, this.option,this.props.id).Dispose;
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
                    const feature = this.map!.forEachFeatureAtPixel([e.offsetX, e.offsetY],
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
    public GetDivMap(){
        return this.refDivMap.current!
    }

    public GetCurrentEPSGProjection() {
        return this.map?.getView().getProjection().getCode();

    }

    public CancelCreate(callback?: () => void) {
        this.map!.removeInteraction(this.draw!);
        if (this.resolvePromise) {
            this.resolvePromise()
            this.isCreate=false;
        }
        if (callback) callback()

    }

    public Rotation(rotation: number) {
        this.map?.getView().setRotation(rotation)
    }


     _addFeatureFromJson(json: string, callback?: () => void) {
        const format = new GeoJSON();
        const features = format.readFeatures(json);
        this.source.addFeatures(features)
        if (callback) callback()
    }

    public GetVectorLayer(): VectorLayer {
        return this.vector!;
    }

    public GetVectorSource(): VectorSource {
        return this.source;
    }

    public GetMap(): Map {
        return this.map!
    }

    /**
     * Перерисовка стилей
     */
    public RefreshStyleFeatures() {

        this.source.getFeatures().forEach((f) => {

            f.setStyle(this.styleOsm.styleFunction)
        })
    }
    public RefreshStyleSettings(){
        this.styleOsm.refreshStyleSettings()
    }

    public SelectFeature(feature: Feature) {
        this.RefreshStyleFeatures();
        feature.setStyle(this.styleOsm?.selectStyle())
    }


    public SelectFeatures(features: Feature[]) {
        this.RefreshStyleFeatures();
        features.forEach(f=>{
            f.setStyle(this.styleOsm?.selectStyle())
        })
    }

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

    public GetMapCoordinate(): {center?:number[],zoom?:number,rotation:number} {
        const view = this.map!.getView()
        return {
            center:view.getCenter(),
            zoom:    view.getZoom(),
            rotation:view.getRotation()
        }
    }

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

    public AddFeatures(f: Feature[]) {
        this.source.addFeatures(f)
    }
    public AddFeature(data:Feature|string){
        if(typeof data ==="string"){
            this._addFeatureFromJson(data)
        }else{
            this.AddFeatures([data])
        }

    }

    public DeleteFeature(f: Feature) {
        this.source.removeFeature(f)
    }

    public DeleteAllFeatures(callback?: () => void) {
        this.source.clear()
        this.map!.removeInteraction(this.draw!);
        if (this.resolvePromise) {
            this.resolvePromise()
        }
        if (callback) callback()

    }


    public GetCenterFeature(feature: Feature):Array<number> {
        return extent.getCenter(feature.getGeometry()!.getExtent())
    }

    public GetCoordinateFeature(feature: Feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getCoordinates();
        } else {
            return [];
        }
    }

    public GetFlatCoordinateFeature(feature: Feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getFlatCoordinates();
        } else {
            return [];
        }
    }
    public GetOptions(){
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
        this.isCreate=true;
        return new Promise<{ bsrMap: BsrMap,isCancel:boolean, feature?: Feature, geometry: string}>((resolve, reject) => {
            try {
                this.mapEventCreated.eventMap.forEach(v=>{
                    v(true,undefined)
                })
                this.map!.removeInteraction(this.selectAltClick);
                this.map!.removeInteraction(this.modify1!);
                this.draw = new Draw({
                    source: this.source,
                    //@ts-ignored
                    type: geometry
                });
                this.resolvePromise = () => {
                    this.mapEventCreated.eventMap.forEach(v=>{
                        v(false,undefined)
                    })
                    this.resolvePromise = undefined
                    resolve({
                        bsrMap: this,
                        isCancel:true,
                        feature: undefined,
                        geometry: geometry,
                    })
                }
                this.draw.on('drawend', (e) => {
                    this.resolvePromise = undefined
                    const feature: Feature = e.feature;
                    this.map!.removeInteraction(this.draw!);
                    this.isCreate=false;
                    if(this.option.onDrawEnd){
                        this.option.onDrawEnd(this,feature)
                    }
                    this.mapEventCreated.eventMap.forEach(v=>{
                        v(true,feature)
                    })
                    // this.editOnlyRouteOrPolygon()
                    resolve({
                        bsrMap: this,
                        isCancel:false,
                        feature: feature,
                        geometry: geometry,
                    })
                });
                this.map!.addInteraction(this.draw!);
            }catch (e){
                this.mapEventCreated.eventMap.forEach(v=>{
                    v(true,undefined)
                })
                this.isCreate=false;
                reject(e)
            }

        })


    }

    /**
     * start edit feature
     * @param feature Feature<Geometry>
     * @param callback callback function
     */
    public StartEditFeature(feature: Feature<Geometry>, callback?: () => void) {
        this.editFeature=feature;
        this.mapEventEntEdit.eventMap.forEach((s)=>{
            s(true,this.editFeature)
        })
        const d: Collection<Feature<Geometry>> = this.selectAltClick.getFeatures();
        if (d.getLength() > 0) {
            this.selectAltClick.getFeatures().clear()
        } else {
            this.selectAltClick.getFeatures().push(feature)
            this.editOnlyRouteOrPolygon()
        }
        this.isEdit=true;
        if (callback) callback()
    }

    public get IsEdit(){
        return  this.isEdit
    }
    public get IsCreate(){
        return this.isCreate
    }
    public AddEvenStateEditingFeature(fun:(stateStart:boolean,f?:Feature<Geometry>)=>void){
        const key=uuid()
        this.mapEventEntEdit.eventMap.set(key,fun)
        return key
    }
    public RemoveEvenStateEditingFeature(key:string){
        this.mapEventEntEdit.eventMap.delete(key)
    }

    public AddEventStateCreatingFeature(fun:(stateStart:boolean,f?:Feature<Geometry>)=>void){
        const key=uuid()
        this.mapEventCreated.eventMap.set(key,fun)
        return key
    }
    public RemoveEventStateCreatingFeature(key:string){
        this.mapEventCreated.eventMap.delete(key)
    }

    /**
     * end of editing feature
     */
    public EndEditFeature(callback?: () => void) {

        this.selectAltClick.getFeatures().clear()
        this.isEdit=false
        this.mapEventEntEdit.eventMap.forEach((s)=>{
            s(false,this.editFeature)
        })
        if (callback) {
            callback()
        }
        this.editFeature=undefined
    }

    /**
     * Assigning default styles
     * @param f target feature
     * @constructor
     */
    public FeatureToJson(f: Feature) {
        const geoJsonGeom = new GeoJSON();
        const featureClone: Feature<Geometry> = f.clone();
        return geoJsonGeom.writeGeometry(featureClone.getGeometry()!);
    }
    public FeaturesToJson(features:Feature<Geometry>[]){
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
        if(this.syncUnmount){
            this.syncUnmount()
        }
    }
    componentDidMount() {
        this.mapEventEntEdit.eventMap.clear()
        this.mapEventCreated.eventMap.clear()
    }

    render() {
        return (
            <div ref={this.refDivMap} style={this.props.style ?? {width: "100%", height: 400}} id={this.props.id ?? this.id}></div>
        )

    }

}

