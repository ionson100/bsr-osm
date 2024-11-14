import React from "react";
import 'ol/ol.css';
import VectorSource from "ol/source/Vector";
import Map from 'ol/Map';
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { OptionOSM } from "./option";
import VectorLayer from "ol/layer/Vector";
export type PropsBsrMap = {
    option?: OptionOSM | undefined;
    featureCollectionAsJson?: string | undefined;
    features?: Feature<Geometry>[] | undefined;
    id?: string | undefined;
    style?: React.CSSProperties | undefined;
};
export declare class BsrMap extends React.Component<PropsBsrMap, any> {
    private mapEbent;
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
    AddEventFinishEditFeature(fun: (f?: Feature<Geometry>) => void): string;
    RemoveEventFinishEditFeature(key: string): void;
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
    componentDidMount(): void;
    render(): React.JSX.Element;
}
