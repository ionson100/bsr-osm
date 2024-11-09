import React from "react";
import {ShowBsrDialog,BaseBodyDialog} from "bsr-modaldialog";
import 'bsr-modaldialog/dist/index.css'
class DialogCreateFeature extends BaseBodyDialog {
    private refGeo=React.createRef<HTMLSelectElement>();
    private refGeoCoo=React.createRef<HTMLTextAreaElement>();

    validate(mode: string | undefined): boolean | undefined {
        if(mode==='1'){
            if(this.refGeoCoo.current?.value.trim()===''){
                return false;
            }
            return true;
        }
        return  true
    }
    getData(mode: string | undefined) {
        const coo:number[]=[]
        this.refGeoCoo.current?.value.trim().split(',').forEach((e)=>{
            coo.push(parseInt(e))
        })
        return {
            g:this.refGeo.current?.value,
            c:coo
        }
    }
    render() {
        return (
            <div style={{margin:30}}>
                <div>Geometry</div>
                <select ref={this.refGeo} defaultValue={'Point'}>
                    <option selected value={'Point'}>Point</option>
                    <option  value={'lineString'}>LineString</option>
                    <option  value={'Polygon'}>Polygon</option>
                </select>
                <div style={{marginTop:10}}>Coordinates</div>
                <textarea ref={this.refGeoCoo} rows={4} style={{width:400}}/>
            </div>
        );
    }
}

export function DialogCreateFeatureF(){
   return  ShowBsrDialog({
        header:(<span style={{paddingLeft:10}}>Create Feature </span>),
        body:<DialogCreateFeature/>,
        buttons: [
            <button data-mode={1}>create</button>,
            <button data-mode={-1}>close</button>]
   })
}