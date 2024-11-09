import React, {useEffect, useRef} from "react";
import {BsrMap} from "./map/mapCore";
import myStateApp from "./stateApp";
import {Feature} from "ol";
import {Point} from "ol/geom";
import ol from "ol/dist/ol";


export default function App3 (){
    const refOSM = useRef<BsrMap>(null)
    const f=new Feature({
        geometry:new Point([2282171.41,7298418.16])
    })
    useEffect(() => {
        myStateApp.map = refOSM.current!
    })
    return (
        <BsrMap ref={refOSM}  features={[f]} option={
           {
               center:[2282171.41,7298418.16],
               zoom:12
           }
        } />

    );

}