class State {
    constructor() {

        this.isAdmin = undefined
        this.isAuth = false;
        this.map = undefined;
        this.audioMap = {};
        this.user = undefined;
        this.leftPanel = undefined;
        this.animatePanel = undefined;
        this.settings = new MSettings()
        this.cloneSettings = Object.assign({}, this.settings)
        this.leftPanelFree = undefined;
        this.titlePanel = undefined;
        this.userData = undefined;
        this.leftMenu = undefined;

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
        // ползунок скорости
        this.rangeValue=10;
        // громкость аудио звучания
        this.volume=0.5;
        this.isShowOverlay=true;
        this.volumePlayer=0.5;
        this.isShowPrivateRoute=false;
        this.openWidth=289;


    }
}
const myState = new State();
export default myState;