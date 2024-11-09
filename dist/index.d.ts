import * as ol_coordinate from 'ol/coordinate';
import React from 'react';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { Geometry, Point, LineString, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';

type OptionOSM = {
    zoom?: number;
    /**
     * [latitude,longitude] ([x,y])
     */
    center?: Array<number>;
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
    useCookiesPosition?: boolean;
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
};

declare enum EPSG {
    EPSG_3857 = "EPSG:3857",
    EPSG_4326 = "EPSG:4326"
}
type PropsBsrMap = {
    option?: OptionOSM;
    featureCollectionAsJson?: string;
    features?: Feature<Geometry>[];
    id?: string;
    style?: React.CSSProperties | undefined;
};
declare class BsrMap extends React.Component<PropsBsrMap, any> {
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
    private initMap;
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
    SelectStyleFeature(feature: Feature): void;
    GoTo(center: number[], zoom?: number, rotation?: number): void;
    GetMapCoordinate(): [number[] | undefined, number | undefined, number];
    GetBound(isJson?: boolean): string | {
        p1?: number[] | undefined;
        p2?: number[] | undefined;
        p3?: number[] | undefined;
        p4?: number[] | undefined;
        p5?: number[] | undefined;
    };
    CreateFeature(geometry: 'Point' | 'LineString' | 'Polygon' | 'Circle', coordinate: Array<any>): Feature<Point> | Feature<LineString> | Feature<Polygon> | undefined;
    GetFeatures(geometry: 'Point' | 'LineString' | 'Polygon' | 'Circle' | undefined): Feature<Geometry>[];
    AddFeatures(f: Feature[]): void;
    RemoveFeature(f: Feature): void;
    RemoveAllFeatures(callback?: () => void): void;
    GetCenterFeature(feature: Feature): ol_coordinate.Coordinate;
    GetCoordinateFeature(feature: Feature): any[] | null;
    GetFlatCoordinateFeature(feature: Feature): number[];
    TransForm(coordinate: Array<number>, from: EPSG | string, to: EPSG | string): Array<number>;
    /**
     * возврат точки при создании маршрута или полигона
     */
    Undo(): void;
    BuildFeature(geometry: 'Polygon' | 'LineString' | 'Point' | 'Circle'): Promise<{
        bsrMap: BsrMap;
        feature: Feature;
        geometry: string;
        json: string;
    }>;
    StartEditFeature(feature: Feature, callback?: () => void): void;
    FinishEditFeature(callback?: () => void): void;
    FeatureToJson(f: Feature): string;
    private editOnlyRouteOrPolygon;
    /**
     * Перерисовка стилей
     */
    RefreshStyleFeature(feature: Feature): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.JSX.Element;
}

export { BsrMap, EPSG, type OptionOSM, type StyleSettings };
