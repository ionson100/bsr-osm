import {OptionOSM} from "./option";



const bsrMap = 'bsr-12'
export type position={
    zoom :number
    center:number[]
    rotation :number
}
 export function parse(hash:string|undefined):position|undefined{
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
    let p=[348869.291502072,5197452.410915278]
    if(option.projection==="EPSG:4326"){
        p=[0,0]
    }
    let center: number[] = option.center ??p;
    let rotation = option.rotation??0;

    if(option.useSynchronizationUrl){

        let myUrl =  new URLSearchParams(window.location.hash.substring(1))
        const tag = myUrl.get("map");


        if (tag) {

            const res=parse(tag)
            if(res){
                return  res;
            }
        } else {
            if(option.useSynchronizationUrl){
                let hashMap = getCookie(bsrMap+id??'')
                if(hashMap){
                    const res=parse(hashMap)
                    if(res){
                        return  res;
                    }
                }
            }

        }
    }

    return {zoom, center, rotation};
}


 export function setCookie(name: string, value: string) {

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