
import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";
import myState from "./state";











export let mySelectPolygon = undefined

function refreshStyleSelectPolygon(){
    mySelectPolygon=new Style({
        fill: new Fill({
            color: hexToRgbASelect(),
        }),
        stroke: new Stroke({
            color: myState.settings.colorPolygonSelect,
            width: myState.settings.widthPolygonSelect
        }),
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({
                color: '#4eff33'
            })
        })
    })
}

let styles=undefined;

export function refreshStyle(){
    refreshStyleSelectPolygon()
    styles= ({

        'LineString': new Style({
            fill: new Fill({
                color: 'rgb(167,81,81)'
            }),
            stroke: new Stroke({
                color:myState.settings.colorRoute,
                width: myState.settings.widthRoute
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33'
                })
            })
        }),
        'Polygon': new Style({
            fill: new Fill({
                color: hexToRgbA(),
            }),
            stroke: new Stroke({
                color: myState.settings.colorPolygon,
                width: myState.settings.widthPolygon
            }),
            image: new CircleStyle({
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
            image: new CircleStyle({
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
            image: new CircleStyle({
                radius: 12,
                fill: new Fill({
                    color: '#a88007'
                })
            })
        }),

    });
}

export function styleFunction(feature) {
    if(!styles){
        refreshStyle()
    }
    return styles[feature.getGeometry().getType()];
}


export function hexToRgbASelect(){
    const hex=myState.settings.fillPolygonSelect
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


export function hexToRgbA(){
    const hex=myState.settings.fillPolygon
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




