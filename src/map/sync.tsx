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

        let myUrl =  new URLSearchParams(window.location.hash.substring(1))
        const tag = myUrl.get("map");


        if (tag) {

            const res=parse(tag)
            if(res){
                return  res;
            }
        } else {
            let hashMap = getCookie(bsrMap+id??'')
            if(hashMap){
                const res=parse(hashMap)
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
        let myUrl =  new URLSearchParams(window.location.hash.substring(1))
        let hashMap = myUrl.get("map");
        if(hashMap){
           parse(hashMap)
        }

    }
    const updatePermalink = () => {
        if (!shouldUpdate) {
            // do not update the URL when the view was changed in the 'popstate' handler
            shouldUpdate = true;
            return;
        }
        const view = map.getView();
        const center = view.getCenter();
        const hashMap =
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
        if(option.useCookiesPosition){
            setCookie(bsrMap+id??'', hashMap)
        }
        let hashNew=  new URLSearchParams(window.location.hash.substring(1))
        let str='/#'
        let appndMap=false
        hashNew.forEach((value,name) => {
            console.log(name+" "+value)
            if(name!=='map'){

                if(str==='/#'){
                    str=str+name+'='+value
                }else{
                    str=str+"&"+name+'='+value
                }

            }else{
                appndMap=true
                if(str==='/#'){
                    str=str+'map='+hashMap
                }else{
                    str=str+'&map='+hashMap
                }
            }
        })
        if(!appndMap){
            if(str==='/#'){
                str=str+"map="+hashMap
            }else{
                str=str+'&map='+hashMap
            }
        }






        window.history.pushState(state, 'map', str);
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