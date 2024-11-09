import React, {useEffect, useRef} from 'react';

import './App.css';
import {BsrMap} from "./map/mapCore";
import myStateApp from "./stateApp";
import {json} from "./features";
import Overlay from 'ol/Overlay.js';


function App() {
    const refOSM = useRef<BsrMap>(null)
    const refButton=useRef<HTMLButtonElement>(null)
    useEffect(() => {
        myStateApp.map = refOSM.current!
        const popup = new Overlay({
            element: refButton.current!,
            positioning:"bottom-left"
        });
        popup.setPosition([2282171.41,7298418.16]);
        refOSM.current!.GetMap().addOverlay(popup)
    })
    return (
       <>
           <button ref={refButton} id={'assa'}>fdfdfdf</button>
           <BsrMap ref={refOSM}
           //featureCollectionAsJson={json}
                 style={{width: "100%", height: "100%"}}
                 option={{
                     useCookiesPosition: true,
                     useSynchronizationUrl: true,
                     useDrawBox: true,
                     onDrawBoxEnd: (map, f, extend) => {
                         console.log(f)
                     },
                     onDragEnd: (map, f, json) => {
                         // console.log(json)
                         // console.log(f)
                         // console.log(map)
                     },
                     onModifyEnd: (f, json) => {
                         //console.log(json)
                     },
                     onShowContextMenu: (f, e) => {
                         console.log(f, e)
                     },
                     onClick: (map, f,evt) => {
                         if(f){
                             map.SelectStyleFeature(f!)
                             myStateApp.currentFeature = f;
                         }

                         //console.log(f)
                     },
                     style: {
                         colorPolygon: "#59ceef",
                         fillPolygon: "#870f0f"
                     }
                 }}/>
       </>

    );
}

export default App;
