import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";




export class StyleOsm {

    constructor(option) {
        this.option = option
        this.styles = ({

            'LineString': new Style({
                fill: new Fill({
                    color: 'rgb(167,81,81)'
                }),
                stroke: new Stroke({
                    color: option.style?.colorRoute ?? '#179a1c',
                    width: option.style?.widthRoute ?? 4
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
                    color: option.style?.colorPolygon ?? '#07720d',
                    width: option.style?.widthPolygon ?? 3
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
        this.stylesSelect = new Style({
            fill: new Fill({
                color: this.hexToRgbAEx(this.option.style?.fillPolygonSelect ?? '#F8F9F4'),
            }),
            stroke: new Stroke({
                color: option.style?.colorPolygonSelect ?? '#f80622',
                width: option.style?.widthPolygonSelect ?? 3
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#4eff33'
                })
            })
        })
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


