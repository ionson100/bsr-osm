import React, { ReactElement } from 'react';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';

type OptionOSM = {
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
     * Feature drag end events on the map, (Ctrl -> mouse drag feature)
     */
    onDragEnd?: (map: BsrMap, feature: Feature) => void;
    /**
     * Events of the end of selection of a rectangular area on the map, used if useDrawBox = true
     * (Shift+Ctrl -> Drawing an area with a mouse)
     * @param features Feature that fell into the selected area
     */
    onDrawBoxEnd?: (map: BsrMap, features: Feature<Geometry>[], extend: Array<number>) => void;
    /**
     * Allows you to draw a rectangular area on the map
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
type StyleSettings = {
    /**
     * Line color LineString
     */
    colorLineString?: string;
    /**
     * Line width
     */
    widthLineString?: number;
    /**
     * Polygon border color
     */
    colorPolygon?: string;
    /**
     * Polygon border width
     */
    widthPolygon?: number;
    /**
     * Polygon fill color
     */
    fillPolygon?: string;
    colorLineSelect?: string;
    widthLineSelect?: number;
    fillBodySelect?: string;
    colorPointSelect?: string;
    colorCircle?: string;
    fillCircle?: string;
    widthCircle?: number;
    colorPoint?: string;
    radiusPoint?: number;
};

type PropsBsrMap = {
    option?: OptionOSM | undefined;
    featuresAsJson?: string | undefined;
    features?: Feature<Geometry>[] | undefined;
    id?: string | undefined;
    style?: React.CSSProperties | undefined;
};
declare class BsrMap extends React.Component<PropsBsrMap, any> {
    private mapEventEntEdit;
    private mapEventCreated;
    private editFeature;
    private isEdit;
    private isCreate;
    private isDispose;
    private refDivMap;
    private resolvePromise?;
    private option;
    private id;
    private styleOsm;
    private source;
    private vector;
    private modify1?;
    private map?;
    private draw?;
    private syncUnmount?;
    private typles;
    private selectAltClick;
    private type;
    constructor(props: Readonly<PropsBsrMap>);
    Dispose(callback?: () => void): void;
    private initMap;
    GetDivMap(): HTMLDivElement;
    GetCurrentEPSGProjection(): string | undefined;
    CancelCreate(callback?: () => void): void;
    Rotation(rotation: number): void;
    _addFeatureFromJson(json: string, callback?: () => void): void;
    GetVectorLayer(): VectorLayer;
    GetVectorSource(): VectorSource;
    GetMap(): Map;
    /**
     * Перерисовка стилей
     */
    RefreshStyleFeatures(): void;
    RefreshStyleSettings(): void;
    SelectFeature(feature: Feature): void;
    SelectFeatures(features: Feature[]): void;
    GoTo(center: number[], zoom?: number, rotation?: number): void;
    GetMapCoordinate(): {
        center?: number[];
        zoom?: number;
        rotation: number;
    };
    GetBound(isJson?: boolean): string | {
        p1?: number[] | undefined;
        p2?: number[] | undefined;
        p3?: number[] | undefined;
        p4?: number[] | undefined;
        p5?: number[] | undefined;
    };
    GetFeatures(geometry: 'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined): Feature<Geometry>[];
    AddFeatures(f: Feature[]): void;
    AddFeature(data: Feature | string): void;
    DeleteFeature(f: Feature): void;
    DeleteAllFeatures(callback?: () => void): void;
    GetCenterFeature(feature: Feature): Array<number>;
    GetCoordinateFeature(feature: Feature): any[] | null;
    GetFlatCoordinateFeature(feature: Feature): number[];
    GetOptions(): OptionOSM;
    /**
     * remove last point when creating a feature
     */
    Undo(): void;
    /**
     * Build, create feature
     * @param geometry 'Polygon' | 'LineString' | 'Point' | 'Circle'
     */
    CreateFeature(geometry: 'Polygon' | 'LineString' | 'Point' | 'Circle'): Promise<{
        bsrMap: BsrMap;
        isCancel: boolean;
        feature?: Feature<Geometry> | undefined;
        geometry: string;
    }>;
    /**
     * start edit feature
     * @param feature Feature<Geometry>
     * @param callback callback function
     */
    StartEditFeature(feature: Feature<Geometry>, callback?: () => void): void;
    get IsEdit(): boolean;
    get IsCreate(): boolean;
    AddEvenStateEditingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void): string;
    RemoveEvenStateEditingFeature(key: string): void;
    AddEventStateCreatingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void): string;
    RemoveEventStateCreatingFeature(key: string): void;
    /**
     * end of editing feature
     */
    EndEditFeature(callback?: () => void): void;
    /**
     * Assigning default styles
     * @param f target feature
     * @constructor
     */
    FeatureToJson(f: Feature): string;
    FeaturesToJson(features: Feature<Geometry>[]): string;
    private editOnlyRouteOrPolygon;
    /**
     * Redrawing features styles
     */
    RefreshStyleFeature(feature: Feature): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.JSX.Element;
}

declare function ProxyMenuDialog(evt: MouseEvent, element: ReactElement): void;

export { BsrMap, type OptionOSM, ProxyMenuDialog, type StyleSettings };
