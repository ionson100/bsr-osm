import React from "react";
import VectorSource from "ol/source/Vector";
import Map from 'ol/Map';
import { Feature } from "ol";
import { Geometry, LineString, Point, Polygon } from "ol/geom";
import { OptionOSM } from "./option";
import VectorLayer from "ol/layer/Vector";
export declare enum EPSG {
    EPSG_3857 = "EPSG:3857",
    EPSG_4326 = "EPSG:4326"
}
export type PropsBsrMap = {
    option?: OptionOSM;
    featureCollectionAsJson?: string;
    features?: Feature<Geometry>[];
    id?: string;
    style?: React.CSSProperties | undefined;
};
export declare class BsrMap extends React.Component<PropsBsrMap, any> {
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
    GetCenterFeature(feature: Feature): import("ol/coordinate").Coordinate;
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
    ConvertFeatureToJson(f: Feature): string;
    private editOnlyRouteOrPolygon;
    /**
     * Перерисовка стилей
     */
    RefreshStyleFeature(feature: Feature): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.JSX.Element;
}
