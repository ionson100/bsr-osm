'use strict';

var React = require('react');
require('ol/ol.css');
var TileLayer = require('ol/layer/Tile');
var source_js = require('ol/source.js');
var VectorSource = require('ol/source/Vector');
var format = require('ol/format');
var interaction_js = require('ol/interaction.js');
var condition = require('ol/events/condition');
var View = require('ol/View.js');
var Map = require('ol/Map');
var interaction = require('ol/interaction');
var geom = require('ol/geom');
var VectorLayer = require('ol/layer/Vector');
var style = require('ol/style');
var extent = require('ol/extent');
var client = require('react-dom/client');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var extent__namespace = /*#__PURE__*/_interopNamespaceDefault(extent);

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
        const geoJsonGeom = new format.GeoJSON();
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

class Drag extends interaction_js.Pointer {
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
        this.styles = {};
        this.refreshStyleSettings();

        this.stylesSelect = new style.Style({
            fill: new style.Fill({
                color: this.hexToRgbAEx(this.option.style?.fillPolygonSelect ?? '#F8F9F4'),
            }),
            stroke: new style.Stroke({
                color: option.style?.colorPolygonSelect ?? '#f80622',
                width: option.style?.widthPolygonSelect ?? 3
            }),
            image: new style.Circle({
                radius: 7,
                fill: new style.Fill({
                    color: '#f80622'
                })
            })
        });
    }
    refreshStyleSettings(){
        this.styles={

            'LineString': new style.Style({
                fill: new style.Fill({
                    color: 'rgb(167,81,81)'
                }),
                stroke: new style.Stroke({
                    color: this.option.style?.colorLineString ?? '#179a1c',
                    width: this.option.style?.widthLineString ?? 4
                }),
                image: new style.Circle({
                    radius: 7,
                    fill: new style.Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            'Polygon': new style.Style({
                fill: new style.Fill({
                    color: this.hexToRgbAEx(this.option.style?.fillPolygon ?? '#F8F9F4'),
                }),
                stroke: new style.Stroke({
                    color: this.option.style?.colorPolygon ?? '#07720d',
                    width: this.option.style?.widthPolygon ?? 3
                }),
                image: new style.Circle({
                    radius: 7,
                    fill: new style.Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            'Circle': new style.Style({
                fill: new style.Fill({
                    color: this.hexToRgbAEx(this.option.style?.fillCircle??'#dd2e2e')
                }),
                stroke: new style.Stroke({
                    color: this.option.style?.colorCircle??'#24f22e',
                    width: this.option.style?.widthCircle??10
                }),

            }),

            'Point': new style.Style({
                image: new style.Circle({
                    radius: this.option.style?.radiusPoint??5,
                    fill: new style.Fill({
                        color: this.option.style?.colorPoint??'#0324fb'
                    })
                })
            }),

        };
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

window.onpopstate = function (event) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
};
var bsrMap$1 = 'bsr-12';
function parse(hash) {
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
    var _a, _b, _c, _d;
    var zoom = (_a = option.zoom) !== null && _a !== void 0 ? _a : 12;
    var p = [352236.29, 5200847.21];
    if (option.projection === "EPSG:4326") {
        p = [0, 0];
    }
    var center = (_b = option.center) !== null && _b !== void 0 ? _b : p;
    var rotation = (_c = option.rotation) !== null && _c !== void 0 ? _c : 0;
    if (option.useSynchronizationUrl) {
        var myUrl = new URLSearchParams(window.location.hash.substring(1));
        var tag = myUrl.get("map");
        if (tag) {
            var res = parse(tag);
            if (res) {
                return res;
            }
        }
        else {
            if (option.useSynchronizationUrl) {
                var hashMap = getCookie((_d = bsrMap$1 + id) !== null && _d !== void 0 ? _d : '');
                if (hashMap) {
                    var res = parse(hashMap);
                    if (res) {
                        return res;
                    }
                }
            }
        }
    }
    return { zoom: zoom, center: center, rotation: rotation };
}
function setCookie(name, value) {
    document.cookie = "".concat(name, "=").concat(value, "; max-age=25920000");
}
// function deleteCookie(name: string) {
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
// }
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )".concat(name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1'), "=([^;]*)")));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var bsrMap = 'bsr-12';
var shouldUpdate = true;
function getHashCore(hashMap) {
    var hashNew = new URLSearchParams(window.location.hash.substring(1));
    var str = '/#';
    var iaAppendMap = false;
    hashNew.forEach(function (value, name) {
        if (name !== 'map') {
            if (str === '/#') {
                str = str + name + '=' + value;
            }
            else {
                str = str + "&" + name + '=' + value;
            }
        }
        else {
            iaAppendMap = true;
            if (str === '/#') {
                str = str + 'map=' + hashMap;
            }
            else {
                str = str + '&map=' + hashMap;
            }
        }
    });
    if (!iaAppendMap) {
        if (str === '/#') {
            str = str + "map=" + hashMap;
        }
        else {
            str = str + '&map=' + hashMap;
        }
    }
    return str;
}
function SyncUrl(map, option, id) {
    var popState = function ( /*event: HashChangeEvent*/) {
        shouldUpdate = false;
        var myUrl = new URLSearchParams(window.location.hash.substring(1));
        var hashMap = myUrl.get("map");
        if (hashMap) {
            var res = parse(hashMap);
            if (res) {
                var view = map.getView();
                view.setCenter(res.center);
                view.setZoom(res.zoom);
                view.setRotation(res.rotation);
                var state = {
                    zoom: view.getZoom(),
                    center: view.getCenter(),
                    rotation: view.getRotation(),
                };
                window.history.replaceState(state, 'map', window.location.hash);
            }
        }
    };
    var updatePermalink = function () {
        var _a;
        if (!shouldUpdate) {
            shouldUpdate = true;
            return;
        }
        var view = map.getView();
        var center = view.getCenter();
        var hash = '' +
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
        setCookie((_a = bsrMap + id) !== null && _a !== void 0 ? _a : '', hash);
        window.history.pushState(state, 'map', getHashCore(hash));
    };
    map.on('moveend', updatePermalink);
    function pp23(event) {
        if (event.state === null) {
            return;
        }
        map.getView().setCenter(event.state.center);
        map.getView().setZoom(event.state.zoom);
        map.getView().setRotation(event.state.rotation);
        shouldUpdate = false;
    }
    window.addEventListener('popstate', pp23);
    map.on('moveend', updatePermalink);
    window.addEventListener("hashchange", popState);
    return function () {
        window.removeEventListener('popstate', pp23);
        window.removeEventListener("hashchange", popState);
        console.log("removeEventListener");
    };
}

var BsrMap = /** @class */ (function (_super) {
    __extends(BsrMap, _super);
    function BsrMap(props) {
        var _this = this;
        var _a;
        _this = _super.call(this, props) || this;
        _this.isDispose = false;
        _this.refDivMap = React.createRef();
        _this.option = (_a = _this.props.option) !== null && _a !== void 0 ? _a : {};
        _this.id = v4();
        _this.styleOsm = new StyleOsm(_this.option);
        _this.source = new VectorSource({ wrapX: false, url: _this.option.sourceUrl });
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
        _this.selectAltClick = new interaction_js.Select({
            //@ts-ignored
            condition: function (mapBrowserEvent) {
                condition.click(mapBrowserEvent);
            },
            filter: function () { return false; }
        });
        _this.type = _this.typles.POINT;
        _this.draw = new interaction_js.Draw({
            source: _this.source,
            //@ts-ignored
            type: _this.type.description
        });
        _this.initMap();
        return _this;
    }
    BsrMap.prototype.Dispose = function (callback) {
        if (!this.isDispose) {
            this.map.getAllLayers().forEach(function (layer) {
                var _a;
                (_a = layer.getSource()) === null || _a === void 0 ? void 0 : _a.dispose();
                layer.dispose();
            });
            this.map.getView().dispose();
            this.map.dispose();
            this.isDispose = true;
            if (this.syncUnmount) {
                this.syncUnmount();
                this.syncUnmount = function () { };
            }
            if (callback)
                callback();
        }
    };
    BsrMap.prototype.initMap = function () {
        var _this = this;
        setTimeout(function () {
            var _a, _b;
            var coordinate = GetPosition(_this.option, _this.props.id);
            _this.map = new Map({
                interactions: interaction_js.defaults().extend([new Drag(_this, _this.option),]),
                layers: [new TileLayer({
                        source: new source_js.OSM(),
                    }), _this.vector],
                target: (_a = _this.props.id) !== null && _a !== void 0 ? _a : _this.id,
                view: new View({
                    projection: (_b = _this.option.projection) !== null && _b !== void 0 ? _b : 'EPSG:3857',
                    center: coordinate.center,
                    rotation: coordinate.rotation,
                    zoom: coordinate.zoom,
                }),
            });
            //this.map.addControl(new ZoomSlider());
            if (_this.option.useSynchronizationUrl) {
                _this.syncUnmount = SyncUrl(_this.map, _this.option, _this.props.id);
            }
            if (_this.option.removeDoubleClickZoom) {
                // убрали из дефолта двойной клик
                _this.map.getInteractions().getArray().forEach(function (interaction$1) {
                    if (interaction$1 instanceof interaction.DoubleClickZoom) {
                        _this.map.removeInteraction(interaction$1);
                    }
                });
            }
            //const link = new Link();
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
                var dragBox_1 = new interaction.DragBox({
                    condition: condition.platformModifierKeyOnly,
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
    BsrMap.prototype.GetDivMap = function () {
        return this.refDivMap.current;
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
        var format$1 = new format.GeoJSON();
        var features = format$1.readFeatures(json);
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
    BsrMap.prototype.RefreshStyleSettings = function () {
        this.styleOsm.refreshStyleSettings();
    };
    BsrMap.prototype.SelectFeature = function (feature) {
        var _a;
        this.RefreshStyleFeatures();
        feature.setStyle((_a = this.styleOsm) === null || _a === void 0 ? void 0 : _a.selectStyle());
    };
    BsrMap.prototype.SelectFeatures = function (features) {
        var _this = this;
        this.RefreshStyleFeatures();
        features.forEach(function (f) {
            var _a;
            f.setStyle((_a = _this.styleOsm) === null || _a === void 0 ? void 0 : _a.selectStyle());
        });
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
        return {
            center: view.getCenter(),
            zoom: view.getZoom(),
            rotation: view.getRotation()
        };
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
    BsrMap.prototype.DeleteFeature = function (f) {
        this.source.removeFeature(f);
    };
    BsrMap.prototype.DeleteAllFeatures = function (callback) {
        this.source.clear();
        this.map.removeInteraction(this.draw);
        if (this.rejectPromise) {
            this.rejectPromise('cancel create user');
        }
        if (callback)
            callback();
    };
    BsrMap.prototype.GetCenterFeature = function (feature) {
        return extent__namespace.getCenter(feature.getGeometry().getExtent());
    };
    BsrMap.prototype.GetCoordinateFeature = function (feature) {
        var geometry = feature.getGeometry();
        if (geometry instanceof geom.SimpleGeometry) {
            return geometry.getCoordinates();
        }
        else {
            return [];
        }
    };
    BsrMap.prototype.GetFlatCoordinateFeature = function (feature) {
        var geometry = feature.getGeometry();
        if (geometry instanceof geom.SimpleGeometry) {
            return geometry.getFlatCoordinates();
        }
        else {
            return [];
        }
    };
    /**
     * remove last point when creating a feature
     */
    BsrMap.prototype.Undo = function () {
        var _a;
        (_a = this.draw) === null || _a === void 0 ? void 0 : _a.removeLastPoint();
    };
    /**
     * Build, create feature
     * @param geometry 'Polygon' | 'LineString' | 'Point' | 'Circle'
     */
    BsrMap.prototype.CreateFeature = function (geometry) {
        var _this = this;
        this.CancelCreate();
        return new Promise(function (resolve, reject) {
            _this.map.removeInteraction(_this.selectAltClick);
            _this.map.removeInteraction(_this.modify1);
            _this.draw = new interaction_js.Draw({
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
                // this.editOnlyRouteOrPolygon()
                resolve({
                    bsrMap: _this,
                    feature: feature,
                    geometry: geometry,
                    json: _this.FeatureToJson(feature)
                });
            });
            _this.map.addInteraction(_this.draw);
        });
    };
    /**
     * start edit feature
     * @param feature Feature<Geometry>
     * @param callback callback function
     */
    BsrMap.prototype.StartEditFeature = function (feature, callback) {
        var d = this.selectAltClick.getFeatures();
        if (d.getLength() > 0) {
            this.selectAltClick.getFeatures().clear();
        }
        else {
            this.selectAltClick.getFeatures().push(feature);
            this.editOnlyRouteOrPolygon();
        }
        if (callback)
            callback();
    };
    /**
     * end of editing feature
     */
    BsrMap.prototype.FinishEditFeature = function (callback) {
        this.selectAltClick.getFeatures().clear();
        if (callback) {
            callback();
        }
    };
    /**
     * Assigning default styles
     * @param f target feature
     * @constructor
     */
    BsrMap.prototype.FeatureToJson = function (f) {
        var geoJsonGeom = new format.GeoJSON();
        var featureClone = f.clone();
        return geoJsonGeom.writeGeometry(featureClone.getGeometry());
    };
    BsrMap.prototype.editOnlyRouteOrPolygon = function () {
        var _this = this;
        this.modify1 = new interaction_js.Modify({
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
     * Redrawing features styles
     */
    BsrMap.prototype.RefreshStyleFeature = function (feature) {
        feature.setStyle(this.styleOsm.styleFunction(feature));
    };
    BsrMap.prototype.componentWillUnmount = function () {
        if (this.syncUnmount) {
            this.syncUnmount();
        }
    };
    BsrMap.prototype.render = function () {
        var _a, _b;
        return (React.createElement("div", { ref: this.refDivMap, style: (_a = this.props.style) !== null && _a !== void 0 ? _a : { width: "100%", height: 400 }, id: (_b = this.props.id) !== null && _b !== void 0 ? _b : this.id }));
    };
    return BsrMap;
}(React.Component));

var ContextMenuMap = /** @class */ (function (_super) {
    __extends(ContextMenuMap, _super);
    function ContextMenuMap(props) {
        return _super.call(this, props) || this;
    }
    ContextMenuMap.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { onClick: function () { _this.props.actionClose(); } }, this.props.element));
    };
    return ContextMenuMap;
}(React.Component));
function ProxyMenuDialog(evt, element) {
    var div = document.createElement("div");
    div.setAttribute("id", "12-23");
    div.className = "bsr-map-context-menu";
    div.style.top = evt.pageY + "px";
    div.style.left = evt.pageX + "px";
    div.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    var innerRoot = client.createRoot(div);
    function close() {
        innerRoot.render(null);
        document.body.removeChild(div);
        document.removeEventListener("mousedown", close);
    }
    document.addEventListener("mousedown", close);
    document.body.appendChild(div);
    innerRoot.render(React.createElement(ContextMenuMap, { element: element, actionClose: close }));
}

exports.BsrMap = BsrMap;
exports.ProxyMenuDialog = ProxyMenuDialog;
