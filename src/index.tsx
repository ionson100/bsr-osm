import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import myStateApp from "./stateApp";
import {json} from "./map/features";
import {MyGeometry} from "./map/utils";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>

      <>
      <div className={"left-menu"}>
          <button onClick={()=>{
              myStateApp.map?.DrawFeatureCollection(json)
          }}>add Features</button>
          <button onClick={()=>{
              console.log(myStateApp.map?.getBound(true))
          }}>getBound as json</button>

          <button onClick={()=>{
              console.log(myStateApp.map?.getBound())
          }}>getBound as object</button>
          <button onClick={()=>{
              console.log(myStateApp.map!.getFeatures(MyGeometry.point))
          }}>get feature</button>
          <button onClick={()=>{
              myStateApp.map!.removeAllFeatures()
          }}>clear feature</button>

          <button onClick={()=>{
              myStateApp.map!.CreatePolygon()
          }}>create polygon</button>
          <button onClick={()=>{
              myStateApp.map!.CreateRoute()
          }}>create polygon</button>

          <button onClick={()=>{
              myStateApp.map!.StartEditFeature(myStateApp.currentFeature)
          }}>StartEditFeature</button>
          <button onClick={()=>{
              myStateApp.map!.FinishEditFeature()
          }}>FinisFeature</button>


      </div>
          <div id={'content'}>
              <App />
          </div>
      </>



  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
