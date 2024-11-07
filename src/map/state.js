class State {
    constructor() {

        this.map = undefined;
        this.user = undefined;
        this.settings = new MSettings()
        this.cloneSettings = Object.assign({}, this.settings)
    }
}
export class MSettings{
    constructor() {
        this.colorRoute='#179a1c'
        this.widthRoute=4

        this.colorPolygon='#07720d'
        this.widthPolygon=3;
        this.fillPolygon='#F8F9F4'

        this.colorPolygonSelect='#f80622'
        this.widthPolygonSelect=3;
        this.fillPolygonSelect='#F8F9F4'



    }
}
const myState = new State();
export default myState;