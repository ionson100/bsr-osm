import React, {useEffect, useRef} from 'react';

import './App.css';
import {BsrMap} from "./map/mapCore";
import myStateApp from "./stateApp";

function App() {
    const refOSM = useRef<BsrMap>(null)
    useEffect(() => {
        myStateApp.map = refOSM.current!
    })
    return (
        <BsrMap ref={refOSM} option={{
            useDrawBox:true,
            onDrawBoxEnd:(map,f,extend)=>{
                console.log(f)
            },
            onDragEnd:(map, f, json)=>{
                // console.log(json)
                // console.log(f)
                // console.log(map)
            },
            onModifyEnd:(f,json)=>{
              //console.log(json)
            },
            onShowContextMenu:(f,e)=>{
              console.log(f,e)
            },
            onClick: (map,f) => {
                map.SelectStyleFeature(f!)
                myStateApp.currentFeature=f;
                //console.log(f)
            }
        }}/>
    );
}

export default App;
