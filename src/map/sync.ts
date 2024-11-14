// import {OptionOSM} from "./option";
// import {parse, setCookie} from "./startPositions";
// import Map from "ol/Map";
//
//
// const bsrMap = 'bsr-12'
//
// let shouldUpdate = true
//
//
// function getHashCore(hashMap: string) {
//
//     let hashNew = new URLSearchParams(window.location.hash.substring(1))
//     let str = '/#'
//     let iaAppendMap = false
//     hashNew.forEach((value, name) => {
//         if (name !== 'map') {
//
//             if (str === '/#') {
//                 str = str + name + '=' + value
//             } else {
//                 str = str + "&" + name + '=' + value
//             }
//
//         } else {
//             iaAppendMap = true
//             if (str === '/#') {
//                 str = str + 'map=' + hashMap
//             } else {
//                 str = str + '&map=' + hashMap
//             }
//         }
//     })
//     if (!iaAppendMap) {
//         if (str === '/#') {
//             str = str + "map=" + hashMap
//         } else {
//             str = str + '&map=' + hashMap
//         }
//     }
//     return str
//
// }
//
// export function SyncUrl(map: Map, option: OptionOSM, id?: string) {
//
//     const popState = (/*event: HashChangeEvent*/) => {
//         shouldUpdate = false
//         let myUrl = new URLSearchParams(window.location.hash.substring(1))
//         let hashMap = myUrl.get("map");
//         if (hashMap) {
//             const res = parse(hashMap)
//             if (res) {
//                 const view = map.getView()
//                 view.setCenter(res.center)
//                 view.setZoom(res.zoom)
//                 view.setRotation(res.rotation)
//                 const state = {
//                     zoom: view.getZoom(),
//                     center: view.getCenter(),
//                     rotation: view.getRotation(),
//                 };
//                 window.history.replaceState(state, 'map', window.location.hash);
//
//             }
//
//         }
//
//     }
//     const updatePermalink = function () {
//         if (!shouldUpdate) {
//             shouldUpdate = true;
//             return;
//         }
//         const view = map.getView()
//
//         const center = view.getCenter();
//         const hash =
//             '' +
//             view.getZoom()!.toFixed(2) +
//             '/' +
//             center![0].toFixed(2) +
//             '/' +
//             center![1].toFixed(2) +
//             '/' +
//             view.getRotation();
//         const state = {
//             zoom: view.getZoom(),
//             center: view.getCenter(),
//             rotation: view.getRotation(),
//         };
//
//             setCookie(bsrMap + id ?? '', hash)
//
//         window.history.pushState(state, 'map', getHashCore(hash));
//     };
//
//     map.on('moveend', updatePermalink);
//     function pp23 (event: PopStateEvent) {
//         if (event.state === null) {
//             return;
//         }
//         map.getView().setCenter(event.state.center);
//         map.getView().setZoom(event.state.zoom);
//         map.getView().setRotation(event.state.rotation);
//         shouldUpdate = false;
//     }
//     window.addEventListener('popstate',pp23 );
//
//
//     map.on('moveend', updatePermalink);
//
//     window.addEventListener("hashchange", popState);
//     return () => {
//         window.removeEventListener('popstate',pp23 );
//         window.removeEventListener("hashchange", popState);
//     }
//
//
// }
export const  all=()=>{}
