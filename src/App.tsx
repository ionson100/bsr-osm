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
            onModifyEnd:(f,json)=>{
              console.log(json)
            },
            onShowContextMenu:(f,e)=>{
              console.log(f,e)
            },
            onClick: (f) => {
                myStateApp.currentFeature=f;
                console.log(f)
            }
        }}/>
    );
}

export default App;
