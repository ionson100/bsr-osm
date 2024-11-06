import {BsrMap} from "./map/mapCore";
import {Feature} from "ol";

export class MyStateApp{
    public map?:BsrMap
    public currentFeature?:any
}
const myStateApp=new MyStateApp()
export default  myStateApp;