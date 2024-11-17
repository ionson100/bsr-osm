import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";




export class StyleOsm {

    constructor(option) {
        this.option = option
        this.styles = {};
        this.stylesSelect = undefined
        this.refreshStyleSettings()
    }
    refreshStyleSettings(){
        this.stylesSelect = new Style({
            fill: new Fill({
                color: this.hexToRgbAEx(this.option.style?.fillBodySelect ?? '#F8F9F4'),
            }),
            stroke: new Stroke({
                color: this.option.style?.colorLineSelect ?? '#f80622',
                width: this.option.style?.widthLineSelect ?? 3
            }),
            image: new CircleStyle({
                radius: this.option.style?.radiusPointSelect??4,
                fill: new Fill({
                    color: this.option.style?.colorPointSelect ?? '#b91818',
                })
            })
        })
        this.styles={

            'LineString': new Style({
                fill: new Fill({
                    color: 'rgb(167,81,81)'
                }),
                stroke: new Stroke({
                    color: this.option.style?.colorLineString ?? '#179a1c',
                    width: this.option.style?.widthLineString ?? 4
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
                    color: this.hexToRgbAEx(this.option.style?.fillPolygon ?? '#F8F9F4'),
                }),
                stroke: new Stroke({
                    color: this.option.style?.colorPolygon ?? '#07720d',
                    width: this.option.style?.widthPolygon ?? 3
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
                    color: this.hexToRgbAEx(this.option.style?.fillCircle??'#dd2e2e')
                }),
                stroke: new Stroke({
                    color: this.option.style?.colorCircle??'#24f22e',
                    width: this.option.style?.widthCircle??10
                }),

            }),

            'Point': new Style({
                image: new CircleStyle({
                    radius: this.option.style?.radiusPoint??5,
                    fill: new Fill({
                        color: this.option.style?.colorPoint??'#0324fb'
                    })
                })
            }),

        }
    }

    styleFunction = (feature) => {
        return this.styles[feature.getGeometry().getType()];
    }

    selectStyle=()=> {
        return this.stylesSelect
    }




    hexToRgbAEx(color){
        const hex=color
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


