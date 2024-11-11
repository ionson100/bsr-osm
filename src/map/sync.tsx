import {OptionOSM} from "./option";
import Map from 'ol/Map';

const bsrMap = 'bsr-12'
export type position={
    zoom :number
    center:number[]
    rotation :number
}
 function parse(hash:string|undefined):position|undefined{
    if(!hash){
        return undefined;
    }
     const parts = hash.split('/');
     if (parts.length === 4) {
         return {
             zoom:parseFloat(parts[0]),
             center:[parseFloat(parts[1]), parseFloat(parts[2])],
             rotation:parseFloat(parts[3])
         }
     }
     return undefined

 }

export function GetPosition(option: OptionOSM,id?:string):position {
    let zoom: number =option.zoom??12;
    let p=[352236.29,5200847.21]
    if(option.projection==="EPSG:4326"){
        p=[0,0]
    }
    let center: number[] = option.center ??p;
    let rotation = 0;

    if(option.useSynchronizationUrl){
        if (window.location.hash !== '') {
            const hash = window.location.hash.replace('#map=', '');
            const res=parse(hash)
            if(res){
                return  res;
            }
        } else {
            let hash = getCookie(bsrMap+id??'')
            if(hash){
                const res=parse(hash.replace('#map=', ''))
                if(res){
                    return  res;
                }
            }
        }
    }

    return {zoom, center, rotation};
}

export function SyncUrl(map: Map, option: OptionOSM,id?:string) {
    let shouldUpdate = true;

    const popState = (/*event: HashChangeEvent*/) => {
        const str = window.location.hash.substring(5).split('/')
        if (str.length !== 4) {
            return
        }

        map!.getView().setCenter([parseInt(str[1]), parseInt(str[2])]);
        map!.getView().setZoom(parseInt(str[0]));
        map!.getView().setRotation(parseInt(str[3]));
        shouldUpdate = false;
    }
    const updatePermalink = () => {
        if (!shouldUpdate) {
            // do not update the URL when the view was changed in the 'popstate' handler
            shouldUpdate = true;
            return;
        }
        const view = map.getView();
        const center = view.getCenter();
        const hash =
            '#map=' +
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
        if(option.useCookiesPosition){
            setCookie(bsrMap+id??'', hash)
        }

        window.history.pushState(state, 'map', hash);
    };
    if (option.useSynchronizationUrl) {


        map.on('moveend', updatePermalink);

        window.addEventListener("hashchange", popState);
        return () => {
            window.removeEventListener("hashchange", popState);
        }
    }
    return () => {
    }
}

function setCookie(name: string, value: string) {

    document.cookie = `${name}=${value}; max-age=25920000`;

}

// function deleteCookie(name: string) {
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
// }


export function getCookie(name: string) {
    const matches = document.cookie.match(new RegExp(
        `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}