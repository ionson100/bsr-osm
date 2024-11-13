import React, { ReactElement } from 'react';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';

type OptionOSM = {
    zoom?: number;
    /**
     * [latitude,longitude] ([x,y])
     */
    center?: Array<number>;
    rotation?: number;
    removeDoubleClickZoom?: boolean;
    onClick?: (map: BsrMap, feature: Feature | undefined, evt: MapBrowserEvent<any>) => void;
    onShowContextMenu?: (map: BsrMap, feature: Feature<Geometry> | undefined, e: MouseEvent) => void;
    onModifyEnd?: (map: BsrMap, feature: Feature<Geometry>, json: string) => void;
    onDrawEnd?: (map: BsrMap, feature: Feature, json: string) => void;
    onDragEnd?: (map: BsrMap, feature: Feature, json: string) => void;
    onDrawBoxEnd?: (map: BsrMap, features: Feature<Geometry>[], extend: Array<number>) => void;
    useDrawBox?: boolean;
    style?: StyleSettings;
    useSynchronizationUrl?: boolean;
    sourceUrl?: string;
    projection?: 'EPSG:4326' | 'EPSG:3857' | string | undefined;
};
type StyleSettings = {
    colorLineString?: string;
    widthLineString?: number;
    colorPolygon?: string;
    widthPolygon?: number;
    fillPolygon?: string;
    colorPolygonSelect?: string;
    widthPolygonSelect?: number;
    fillPolygonSelect?: string;
    colorCircle?: string;
    fillCircle?: string;
    widthCircle?: number;
    colorPoint?: string;
    radiusPoint?: number;
};

type PropsBsrMap = {
    option?: OptionOSM | undefined;
    featureCollectionAsJson?: string | undefined;
    features?: Feature<Geometry>[] | undefined;
    id?: string | undefined;
    style?: React.CSSProperties | undefined;
};
declare class BsrMap extends React.Component<PropsBsrMap, any> {
    private isDispose;
    private refDivMap;
    private rejectPromise?;
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
    DrawFeatureCollection(json: string, callback?: () => void): void;
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
    DeleteFeature(f: Feature): void;
    DeleteAllFeatures(callback?: () => void): void;
    GetCenterFeature(feature: Feature): Array<number>;
    GetCoordinateFeature(feature: Feature): any[] | null;
    GetFlatCoordinateFeature(feature: Feature): number[];
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
        feature: Feature;
        geometry: string;
        json: string;
    }>;
    /**
     * start edit feature
     * @param feature Feature<Geometry>
     * @param callback callback function
     */
    StartEditFeature(feature: Feature<Geometry>, callback?: () => void): void;
    /**
     * end of editing feature
     */
    FinishEditFeature(callback?: () => void): void;
    /**
     * Assigning default styles
     * @param f target feature
     * @constructor
     */
    FeatureToJson(f: Feature): string;
    private editOnlyRouteOrPolygon;
    /**
     * Redrawing features styles
     */
    RefreshStyleFeature(feature: Feature): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}

declare function ProxyMenuDialog(evt: MouseEvent, element: ReactElement): void;

export { BsrMap, type OptionOSM, ProxyMenuDialog, type StyleSettings };
