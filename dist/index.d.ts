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
     * Feature drag end events on the map, (Ctrl+Shift -> mouse drag feature)
     */
    onDragEnd?: (map: BsrMap, feature: Feature) => void;
    /**
     * Events of the end of selection of a rectangular area on the map, used if useDrawBox = true
     * (Ctrl -> Drawing an area with a mouse)
     * @param features Feature that fell into the selected area
     */
    onDrawBoxEnd?: (map: BsrMap, features: Feature<Geometry>[], extend: Array<number>) => void;
    /**
     * Allows you to draw a rectangular area on the map. (Ctrl -> Drawing an area with a mouse)
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
     * Line color LineString. default: '#179a1c'
     */
    colorLineString?: string;
    /**
     * Line width. default:4
     */
    widthLineString?: number;
    /**
     * Polygon border color. default:'#07720d'
     */
    colorPolygon?: string;
    /**
     * Polygon border width. default:3
     */
    widthPolygon?: number;
    /**
     * Polygon fill color. default:'#F8F9F4'
     */
    fillPolygon?: string;
    /**
     * select Line color LineString and Circle. default:'#f80622'
     */
    colorLineSelect?: string;
    /**
     * Select Line width LineString and Circle. default:3
     */
    widthLineSelect?: number;
    /**
     * Polygon, Circle fill color. default:'#F8F9F4'
     */
    fillBodySelect?: string;
    /**
     * Select Point color. default:'#b91818'
     */
    colorPointSelect?: string;
    /**
     * Select Radius Point: default:6
     */
    radiusPointSelect?: number;
    /**
     * Circle color. default:'#24f22e'
     */
    colorCircle?: string;
    /**
     * Circle fill color. default:'#dd2e2e'
     */
    fillCircle?: string;
    /**
     * Circle border width. default:5
     */
    widthCircle?: number;
    /**
     * Point color. default:'#0324fb'
     */
    colorPoint?: string;
    /**
     * Point radius. default:5
     */
    radiusPoint?: number;
};

type PropsBsrMap = {
    /**
     * options map
     */
    option?: OptionOSM | undefined;
    /**
     * GeoJson as string
     */
    featuresAsJson?: string | undefined;
    /**
     * Array features
     */
    features?: Feature<Geometry>[] | undefined;
    /**
     * diw attribute id, used to form the name of the cookie
     */
    id?: string | undefined;
    /**
     *diw style.
     */
    style?: React.CSSProperties | undefined;
    /**
     * Class name attribute diw map
     */
    className?: string | undefined;
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
    /**
     * Disposal of a map object
     * @param callback callback function
     */
    Dispose(callback?: () => void): void;
    private initMap;
    /**
     * Getting a div that contains a card
     */
    GetDivMap(): HTMLDivElement;
    /**
     * Getting the current map projection
     */
    GetCurrentEPSGProjection(): string | undefined;
    /**
     * Canceling a geometry creation operation
     * @param callback callback function
     */
    CancelCreate(callback?: () => void): void;
    /**
     * Rotate the map
     * @param rotation rotation magnitude
     */
    Rotation(rotation: number): void;
    _addFeatureFromJson(json: string, callback?: () => void): void;
    /**
     * Getting ol.VectorLayer
     */
    GetVectorLayer(): VectorLayer;
    /**
     * Getting ol.VectorSource
     */
    GetVectorSource(): VectorSource;
    /**
     * Getting ol.Map
     */
    GetMap(): Map;
    /**
     * Redrawing Feature Styles
     */
    RefreshStyleFeatures(): void;
    /**
     * Overloading option styles is usually required if you have changed styles programmatically.
     */
    RefreshStyleSettings(): void;
    /**
     * Redrawing feature styles into selected styles
     * @param feature target Feature
     */
    SelectFeature(feature: Feature): void;
    /**
     * Redrawing features styles into selected styles
     * @param features target Features
     */
    SelectFeatures(features: Feature[]): void;
    /**
     * Redrawing a card to a new position
     * @param center center map
     * @param zoom zoom map
     * @param rotation rotation map
     */
    GoTo(center: number[], zoom?: number, rotation?: number): void;
    /**
     * Getting the current map display coordinates
     */
    GetMapCoordinate(): {
        center?: number[];
        zoom?: number;
        rotation: number;
    };
    /**
     * Getting the coordinates of a square, displaying a map in a browser, can be obtained as an object or as a json string
     * @param isJson request as json
     */
    GetBound(isJson?: boolean): string | {
        p1?: number[] | undefined;
        p2?: number[] | undefined;
        p3?: number[] | undefined;
        p4?: number[] | undefined;
        p5?: number[] | undefined;
    };
    /**
     * Getting features from a map, you can select the geometry type, when selecting undefined all features are selected
     * @param geometry  'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined
     */
    GetFeatures(geometry: 'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined): Feature<Geometry>[];
    /**
     * Adding Features to a Map
     */
    AddFeatures(f: Feature[]): void;
    /**
     * Adding Feature to a Map
     * @param data Feature or GeoJson as string
     */
    AddFeature(data: Feature | string): void;
    /**
     * Removing Feature from a Map
     * @param f Feature to be removed
     */
    DeleteFeature(f: Feature): void;
    /**
     * Deleting all features from the map
     * @param callback callback function
     */
    DeleteAllFeatures(callback?: () => void): void;
    /**
     * Getting the center of feature
     */
    GetCenterFeature(feature: Feature): Array<number>;
    /**
     * Getting Feature Coordinates
     */
    GetCoordinateFeature(feature: Feature): any[] | null;
    /**
     * Getting  Feature flat Coordinates
     */
    GetFlatCoordinateFeature(feature: Feature): number[];
    /**
     * Getting options from props
     */
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
    /**
     * Get the map state, whether the map is in geometry editing state
     */
    get IsEdit(): boolean;
    /**
     * Get the state of the map, whether the map is in the state of creating geometry
     */
    get IsCreate(): boolean;
    /**
     * Subscribe to feature edit events, returns a key that can be used to unsubscribe
     */
    AddEvenStateEditingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void): string;
    /**
     * Unsubscribing to Feature Editing Events
     * @param key event key
     */
    RemoveEvenStateEditingFeature(key: string): void;
    /**
     * Subscribe to feature creation events, returns a key that can be used to unsubscribe
     */
    AddEventStateCreatingFeature(fun: (stateStart: boolean, f?: Feature<Geometry>) => void): string;
    /**
     * Unsubscribing to geometry creation events
     * @param key event key
     */
    RemoveEventStateCreatingFeature(key: string): void;
    /**
     * end of editing feature
     */
    EndEditFeature(callback?: () => void): void;
    /**
     * Transforming Feature into  geo json
     */
    FeatureToJson(f: Feature): string;
    /**
     * Transforming Feature into  geo json collection
     */
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

export { BsrMap, ProxyMenuDialog };
export type { OptionOSM, StyleSettings };
