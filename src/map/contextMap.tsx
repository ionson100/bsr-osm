import React, {ReactElement} from "react";
import {createRoot} from "react-dom/client";
export type ContextMapProps = {

    actionClose:()=>void
    element:ReactElement



}
class ContextMenuMap extends React.Component<ContextMapProps, any>{
    constructor(props:Readonly<ContextMapProps>) {
        super(props);
    }
    render() {
        return (
                <div onClick={()=>{this.props.actionClose()}}>
                    {
                        this.props.element
                    }
                </div>
        )
    }

}

export function ProxyMenuDialog(evt: MouseEvent, element:ReactElement) {
    const div = document.createElement("div");
    div.setAttribute("id", "12-23");
    div.className= "bsr-map-context-menu";
    div.style.top=evt.pageY+"px"
    div.style.left=evt.pageX+"px"
    div.onmousedown= (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

    }
    const innerRoot = createRoot(div);
    function close(){
        innerRoot.render(null)
        document.body.removeChild(div)
        document.removeEventListener("mousedown",close)
    }
    document.addEventListener("mousedown",close)
    document.body.appendChild(div)
    innerRoot.render(<ContextMenuMap element={element}  actionClose={close}  />)
}