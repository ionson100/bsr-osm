import {OptionOSM} from "./option";
import {parse, setCookie} from "./startPositions";
import Map from "ol/Map";


const bsrMap = 'bsr-12'

let shouldUpdate = true

export class SyncUrl2 {
    private map: Map;
    private option: OptionOSM
    id?: string

    constructor(map: Map, option: OptionOSM, id?: string) {
        this.map = map;
        this.option = option;
        this.id=id;

        this.map.on('moveend', this.updatePermalink);
        window.addEventListener('popstate', this.pp23.bind(this));
        window.addEventListener("hashchange", this.popState.bind(this));
    }

    popState = () => {
        shouldUpdate = false
        let myUrl = new URLSearchParams(window.location.hash.substring(1))
        let hashMap = myUrl.get("map");
        if (hashMap) {
            const res = parse(hashMap)
            if (res) {
                const view = this.map.getView()
                view.setCenter(res.center)
                view.setZoom(res.zoom)
                view.setRotation(res.rotation)
                const state = {
                    zoom: view.getZoom(),
                    center: view.getCenter(),
                    rotation: view.getRotation(),
                };
                window.history.replaceState(state, 'map', window.location.hash);

            }

        }
    }

    getHashCore = (hashMap: string) => {

        let hashNew = new URLSearchParams(window.location.hash.substring(1))
        let str = '/#'
        let iaAppendMap = false
        hashNew.forEach((value, name) => {
            if (name !== 'map') {

                if (str === '/#') {
                    str = str + name + '=' + value
                } else {
                    str = str + "&" + name + '=' + value
                }

            } else {
                iaAppendMap = true
                if (str === '/#') {
                    str = str + 'map=' + hashMap
                } else {
                    str = str + '&map=' + hashMap
                }
            }
        })
        if (!iaAppendMap) {
            if (str === '/#') {
                str = str + "map=" + hashMap
            } else {
                str = str + '&map=' + hashMap
            }
        }
        return str

    }

    updatePermalink = () => {
        if (!shouldUpdate) {
            shouldUpdate = true;
            return;
        }
        const view = this.map.getView()

        const center = view.getCenter();
        const hash =
            '' +
            view.getZoom()!.toFixed(2) +
            '/' +
            center![0].toFixed(2) +
            '/' +
            center![1].toFixed(2) +
            '/' +
            view.getRotation();
        const state = {
            zoom: view.getZoom(),
            center: view.getCenter(),
            rotation: view.getRotation(),
        };

        setCookie(bsrMap + this.id ?? '', hash)

        window.history.pushState(state, 'map', this.getHashCore(hash));
    };

    pp23 = (event: PopStateEvent) => {
        if (event.state === null) {
            return;
        }

        this.map.getView().setCenter(event.state.center);
        this.map.getView().setZoom(event.state.zoom);
        this.map.getView().setRotation(event.state.rotation);
        shouldUpdate = false;
    }

    public Dispose=()=>{
        window.removeEventListener('popstate',this.pp23 );
        //window.removeEventListener("hashchange", this.popState);
    }
}


