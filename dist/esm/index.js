import React from 'react';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source.js';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Pointer, Select, Draw, defaults, Modify } from 'ol/interaction.js';
import { click, platformModifierKeyOnly } from 'ol/events/condition';
import View from 'ol/View.js';
import Map from 'ol/Map';
import { DoubleClickZoom, DragBox } from 'ol/interaction';
import { Feature } from 'ol';
import { Polygon, LineString, Point, SimpleGeometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import * as extent from 'ol/extent';
import { transform } from 'ol/proj';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

function handleDownEvent(evt) {
    const run=evt.activePointers[0]?.shiftKey=== true&&evt.activePointers[0]?.ctrlKey===true;
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
            this.option.onDragEnd(this.bsrMap, this.feature_, json);
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

class Drag extends Pointer {
    constructor(bsrMap, option) {
        super({
            handleDownEvent: handleDownEvent,
            handleDragEvent: handleDragEvent,
            handleMoveEvent: handleMoveEvent,
            handleUpEvent: handleUpEvent,
        });
        this.bsrMap = bsrMap;
        this.option = option;
        this.coordinate_ = null;
        this.cursor_ = 'pointer';
        this.feature_ = null;
        this.drag_ = null;
        this.previousCursor_ = undefined;
    }
}

class StyleOsm {

    constructor(option) {
        this.option = option;
        this.styles = ({

            'LineString': new Style({
                fill: new Fill({
                    color: 'rgb(167,81,81)'
                }),
                stroke: new Stroke({
                    color: option.style?.colorRoute ?? '#179a1c',
                    width: option.style?.widthRoute ?? 4
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            'Polygon': new Style({
                fill: new Fill({
                    color: this.hexToRgbAEx(this.option.style?.fillPolygon ?? '#F8F9F4'),
                }),
                stroke: new Stroke({
                    color: option.style?.colorPolygon ?? '#07720d',
                    width: option.style?.widthPolygon ?? 3
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            'Circle': new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: '#03e80e',
                    width: 3
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            }),

            'Point': new Style({
                fill: new Fill({
                    color: 'rgba(182,85,85,0.2)'
                }),
                stroke: new Stroke({
                    color: '#03e80e',
                    width: 3
                }),
                image: new Circle({
                    radius: 12,
                    fill: new Fill({
                        color: '#a88007'
                    })
                })
            }),

        });
        this.stylesSelect = new Style({
            fill: new Fill({
                color: this.hexToRgbAEx(this.option.style?.fillPolygonSelect ?? '#F8F9F4'),
            }),
            stroke: new Stroke({
                color: option.style?.colorPolygonSelect ?? '#f80622',
                width: option.style?.widthPolygonSelect ?? 3
            }),
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: '#4eff33'
                })
            })
        });
    }

    styleFunction = (feature) => {
        return this.styles[feature.getGeometry().getType()];
    }

    selectStyle=()=> {
        return this.stylesSelect
    }




    hexToRgbAEx(color){
        const hex=color;
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length=== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.2)';
        }
        throw new Error('Bad Hex');
    }
}

var bsrMap = 'bsr-12';
function parce(hash) {
    if (!hash) {
        return undefined;
    }
    var parts = hash.split('/');
    if (parts.length === 4) {
        return {
            zoom: parseFloat(parts[0]),
            center: [parseFloat(parts[1]), parseFloat(parts[2])],
            rotation: parseFloat(parts[3])
        };
    }
    return undefined;
}
function GetPosition(option, id) {
    var _a, _b, _c;
    var zoom = (_a = option.zoom) !== null && _a !== void 0 ? _a : 15;
    var center = (_b = option.center) !== null && _b !== void 0 ? _b : [0, 0]; // [1608429.01, 6461053.51];
    var rotation = 0;
    if (option.useSynchronizationUrl) {
        if (window.location.hash !== '') {
            var hash = window.location.hash.replace('#map=', '');
            var res = parce(hash);
            if (res) {
                return res;
            }
        }
        else {
            var hash = getCookie((_c = bsrMap + id) !== null && _c !== void 0 ? _c : '');
            if (hash) {
                var res = parce(hash.replace('#map=', ''));
                if (res) {
                    return res;
                }
            }
        }
    }
    return { zoom: zoom, center: center, rotation: rotation };
}
function SyncUrl(map, option, id) {
    var shouldUpdate = true;
    var popState = function (event) {
        var str = window.location.hash.substring(5).split('/');
        if (str.length !== 4) {
            return;
        }
        map.getView().setCenter([parseInt(str[1]), parseInt(str[2])]);
        map.getView().setZoom(parseInt(str[0]));
        map.getView().setRotation(parseInt(str[3]));
        shouldUpdate = false;
    };
    var updatePermalink = function () {
        var _a;
        if (!shouldUpdate) {
            // do not update the URL when the view was changed in the 'popstate' handler
            shouldUpdate = true;
            return;
        }
        var view = map.getView();
        var center = view.getCenter();
        var hash = '#map=' +
            view.getZoom().toFixed(2) +
            '/' +
            center[0].toFixed(2) +
            '/' +
            center[1].toFixed(2) +
            '/' +
            view.getRotation();
        var state = {
            zoom: view.getZoom(),
            center: view.getCenter(),
            rotation: view.getRotation(),
        };
        if (option.useCookiesPosition) {
            setCookie((_a = bsrMap + id) !== null && _a !== void 0 ? _a : '', hash);
        }
        window.history.pushState(state, 'map', hash);
    };
    if (option.useSynchronizationUrl) {
        map.on('moveend', updatePermalink);
        window.addEventListener("hashchange", popState);
        return function () {
            window.removeEventListener("hashchange", popState);
        };
    }
    return function () {
    };
}
function setCookie(name, value) {
    document.cookie = "".concat(name, "=").concat(value, "; max-age=25920000");
}
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )".concat(name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1'), "=([^;]*)")));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var EPSG;
(function (EPSG) {
    EPSG["EPSG_3857"] = "EPSG:3857";
    EPSG["EPSG_4326"] = "EPSG:4326";
})(EPSG || (EPSG = {}));
var BsrMap = /** @class */ (function (_super) {
    __extends(BsrMap, _super);
    function BsrMap(props) {
        var _this = this;
        var _a;
        _this = _super.call(this, props) || this;
        _this.option = (_a = _this.props.option) !== null && _a !== void 0 ? _a : {};
        _this.id = v4();
        _this.styleOsm = new StyleOsm(_this.option);
        _this.source = new VectorSource({ wrapX: false });
        _this.vector = new VectorLayer({
            //format: new GeoJSON(),
            source: _this.source,
            style: _this.styleOsm.styleFunction
        });
        _this.typles = Object.freeze({
            NONE: Symbol('None'),
            POLYGON: Symbol('Polygon'),
            LINE: Symbol('LineString'),
            POINT: Symbol('Point'),
            CIRCLE: Symbol('Circle'),
        });
        _this.selectAltClick = new Select({
            //@ts-ignored
            condition: function (mapBrowserEvent) {
                click(mapBrowserEvent);
            },
            filter: function () { return false; }
        });
        _this.type = _this.typles.POINT;
        _this.draw = new Draw({
            source: _this.source,
            //@ts-ignored
            type: _this.type.description
        });
        _this.initMap();
        return _this;
    }
    BsrMap.prototype.initMap = function () {
        var _this = this;
        setTimeout(function () {
            var _a;
            var coordinate = GetPosition(_this.option, _this.props.id);
            _this.map = new Map({
                interactions: defaults().extend([new Drag(_this, _this.option),]),
                layers: [new TileLayer({
                        source: new OSM(),
                    }), _this.vector],
                target: (_a = _this.props.id) !== null && _a !== void 0 ? _a : _this.id,
                view: new View({
                    //projection: 'EPSG:4326',
                    center: coordinate.center,
                    rotation: coordinate.rotation,
                    zoom: coordinate.zoom,
                }),
            });
            _this.syncUnmount = SyncUrl(_this.map, _this.option, _this.props.id);
            if (_this.option.removeDoubleClickZoom) {
                // убрали из дефолта двойной клик
                _this.map.getInteractions().getArray().forEach(function (interaction) {
                    if (interaction instanceof DoubleClickZoom) {
                        _this.map.removeInteraction(interaction);
                    }
                });
            }
            if (_this.option.onClick) {
                _this.map.on("click", function (evt) {
                    var feature = _this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                        return feature;
                    });
                    if (feature) {
                        _this.option.onClick(_this, feature, evt);
                    }
                    else {
                        _this.option.onClick(_this, undefined, evt);
                    }
                });
            }
            if (_this.option.onShowContextMenu) {
                _this.map.getViewport().addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                    var feature = _this.map.forEachFeatureAtPixel([e.offsetX, e.offsetY], function (feature) {
                        return feature;
                    });
                    _this.option.onShowContextMenu(_this, feature, e);
                });
            }
            if (_this.option.useDrawBox) {
                var dragBox_1 = new DragBox({
                    condition: platformModifierKeyOnly,
                    className: "box-123"
                });
                if (_this.option.onDrawBoxEnd) {
                    dragBox_1.on('boxend', function () {
                        var boxExtent = dragBox_1.getGeometry().getExtent();
                        var boxFeatures = _this.source.getFeaturesInExtent(boxExtent);
                        _this.option.onDrawBoxEnd(_this, boxFeatures, boxExtent);
                    });
                }
                _this.map.addInteraction(dragBox_1);
            }
        });
        if (this.props.featureCollectionAsJson) {
            this.DrawFeatureCollection(this.props.featureCollectionAsJson);
        }
        if (this.props.features) {
            this.source.addFeatures(this.props.features);
        }
    };
    BsrMap.prototype.GetCurrentEPSGProjection = function () {
        var _a;
        return (_a = this.map) === null || _a === void 0 ? void 0 : _a.getView().getProjection().getCode();
    };
    BsrMap.prototype.CancelCreate = function (callback) {
        this.map.removeInteraction(this.draw);
        if (this.rejectPromise) {
            this.rejectPromise('cancel create user');
        }
        if (callback)
            callback();
    };
    BsrMap.prototype.Rotation = function (rotation) {
        var _a;
        (_a = this.map) === null || _a === void 0 ? void 0 : _a.getView().setRotation(rotation);
    };
    BsrMap.prototype.DrawFeatureCollection = function (json, callback) {
        var format = new GeoJSON();
        var features = format.readFeatures(json);
        this.source.addFeatures(features);
        if (callback)
            callback();
    };
    BsrMap.prototype.GetVectorLayer = function () {
        return this.vector;
    };
    BsrMap.prototype.GetVectorSource = function () {
        return this.source;
    };
    BsrMap.prototype.GetMap = function () {
        return this.map;
    };
    /**
     * Перерисовка стилей
     */
    BsrMap.prototype.RefreshStyleFeatures = function () {
        var _this = this;
        this.source.getFeatures().forEach(function (f) {
            f.setStyle(_this.styleOsm.styleFunction);
        });
    };
    BsrMap.prototype.SelectStyleFeature = function (feature) {
        var _a;
        this.RefreshStyleFeatures();
        feature.setStyle((_a = this.styleOsm) === null || _a === void 0 ? void 0 : _a.selectStyle());
    };
    BsrMap.prototype.GoTo = function (center, zoom, rotation) {
        var view = this.map.getView();
        view.setCenter(center);
        if (zoom) {
            view.setZoom(zoom);
        }
        if (rotation) {
            view.setRotation(rotation);
        }
    };
    BsrMap.prototype.GetMapCoordinate = function () {
        var view = this.map.getView();
        return [view.getCenter(), view.getZoom(), view.getRotation()];
    };
    BsrMap.prototype.GetBound = function (isJson) {
        var extent = this.map.getView().calculateExtent(this.map.getSize());
        var bound = {};
        bound.p1 = [extent[0], extent[3]];
        bound.p2 = [extent[2], extent[3]];
        bound.p3 = [extent[2], extent[1]];
        bound.p4 = [extent[0], extent[1]];
        bound.p5 = [extent[0], extent[3]];
        if (isJson) {
            return JSON.stringify(bound);
        }
        return bound;
    };
    BsrMap.prototype.CreateFeature = function (geometry, coordinate) {
        switch (geometry) {
            case 'Point':
                return new Feature({
                    geometry: new Point(coordinate),
                });
            case 'LineString':
                return new Feature({
                    geometry: new LineString(coordinate),
                });
            case 'Polygon':
                return new Feature({
                    geometry: new Polygon(coordinate),
                });
        }
    };
    BsrMap.prototype.GetFeatures = function (geometry) {
        switch (geometry) {
            case undefined: {
                return this.source.getFeatures();
            }
            case 'Point': {
                return this.source.getFeatures().filter(function (f) {
                    var _a;
                    return ((_a = f.getGeometry()) === null || _a === void 0 ? void 0 : _a.getType()) === 'Point';
                });
            }
            case 'LineString': {
                return this.source.getFeatures().filter(function (f) {
                    var _a;
                    return ((_a = f.getGeometry()) === null || _a === void 0 ? void 0 : _a.getType()) === 'LineString';
                });
            }
            case 'Polygon': {
                return this.source.getFeatures().filter(function (f) {
                    var _a;
                    return ((_a = f.getGeometry()) === null || _a === void 0 ? void 0 : _a.getType()) === 'Polygon';
                });
            }
            case 'Circle': {
                return this.source.getFeatures().filter(function (f) {
                    var _a;
                    return ((_a = f.getGeometry()) === null || _a === void 0 ? void 0 : _a.getType()) === 'Circle';
                });
            }
        }
    };
    BsrMap.prototype.AddFeatures = function (f) {
        this.source.addFeatures(f);
    };
    BsrMap.prototype.RemoveFeature = function (f) {
        this.source.removeFeature(f);
    };
    BsrMap.prototype.RemoveAllFeatures = function (callback) {
        this.source.clear();
        this.map.removeInteraction(this.draw);
        if (this.rejectPromise) {
            this.rejectPromise('cancel create user');
        }
        if (callback)
            callback();
    };
    BsrMap.prototype.GetCenterFeature = function (feature) {
        return extent.getCenter(feature.getGeometry().getExtent());
    };
    BsrMap.prototype.GetCoordinateFeature = function (feature) {
        var geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getCoordinates();
        }
        else {
            return [];
        }
    };
    BsrMap.prototype.GetFlatCoordinateFeature = function (feature) {
        var geometry = feature.getGeometry();
        if (geometry instanceof SimpleGeometry) {
            return geometry.getFlatCoordinates();
        }
        else {
            return [];
        }
    };
    BsrMap.prototype.TransForm = function (coordinate, from, to) {
        return transform(coordinate, from, to);
    };
    /**
     * возврат точки при создании маршрута или полигона
     */
    BsrMap.prototype.Undo = function () {
        var _a;
        (_a = this.draw) === null || _a === void 0 ? void 0 : _a.removeLastPoint();
    };
    BsrMap.prototype.BuildFeature = function (geometry) {
        var _this = this;
        this.CancelCreate();
        return new Promise(function (resolve, reject) {
            _this.map.removeInteraction(_this.selectAltClick);
            _this.map.removeInteraction(_this.modify1);
            _this.draw = new Draw({
                source: _this.source,
                //@ts-ignored
                type: geometry
            });
            _this.rejectPromise = function (msg) {
                _this.rejectPromise = undefined;
                reject(msg);
            };
            _this.draw.on('drawend', function (e) {
                _this.rejectPromise = undefined;
                var feature = e.feature;
                _this.map.removeInteraction(_this.draw);
                _this.editOnlyRouteOrPolygon();
                resolve({
                    bsrMap: _this,
                    feature: feature,
                    geometry: geometry,
                    json: _this.FeatureToJson(feature)
                });
                // setTimeout(() => {
                //     this.selectAltClick?.getFeatures().clear()
                //     this.selectAltClick.getFeatures().push(feature)
                // }, 500)
            });
            _this.map.addInteraction(_this.draw);
        });
    };
    BsrMap.prototype.StartEditFeature = function (feature, callback) {
        var d = this.selectAltClick.getFeatures();
        if (d.getLength() > 0) {
            this.selectAltClick.getFeatures().clear();
        }
        else {
            this.selectAltClick.getFeatures().push(feature);
        }
        if (callback)
            callback();
    };
    BsrMap.prototype.FinishEditFeature = function (callback) {
        this.selectAltClick.getFeatures().clear();
        if (callback) {
            callback();
        }
    };
    BsrMap.prototype.FeatureToJson = function (f) {
        var geoJsonGeom = new GeoJSON();
        var featureClone = f.clone();
        return geoJsonGeom.writeGeometry(featureClone.getGeometry());
    };
    BsrMap.prototype.editOnlyRouteOrPolygon = function () {
        var _this = this;
        this.modify1 = new Modify({
            features: this.selectAltClick.getFeatures()
        });
        if (this.option.onModifyEnd) {
            this.modify1.on('modifyend', function (event) {
                event.features.forEach(function (feature) {
                    _this.option.onModifyEnd(_this, feature, _this.FeatureToJson(feature));
                });
            });
        }
        this.map.addInteraction(this.modify1);
        this.map.addInteraction(this.selectAltClick);
    };
    /**
     * Перерисовка стилей
     */
    BsrMap.prototype.RefreshStyleFeature = function (feature) {
        feature.setStyle(this.styleOsm.styleFunction(feature));
    };
    BsrMap.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.syncUnmount) === null || _a === void 0 ? void 0 : _a.apply(undefined);
    };
    BsrMap.prototype.componentDidMount = function () {
        // const format = new GeoJSON();
        // const features = format.readFeatures(json);
        // source.addFeatures(features)
    };
    BsrMap.prototype.render = function () {
        var _a, _b;
        console.log(this.props.id);
        return (React.createElement("div", { style: (_a = this.props.style) !== null && _a !== void 0 ? _a : { width: "100%", height: 400 }, id: (_b = this.props.id) !== null && _b !== void 0 ? _b : this.id }));
    };
    return BsrMap;
}(React.Component));

export { BsrMap };
