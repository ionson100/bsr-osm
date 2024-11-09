import React, {useEffect, useRef} from "react";
import {BsrMap} from "./map/mapCore";
import myStateApp from "./stateApp";

export default function App2 (){
    const refOSM = useRef<BsrMap>(null)
    useEffect(() => {
        myStateApp.map = refOSM.current!
    })
    return (
        <BsrMap ref={refOSM}  />

    );

}