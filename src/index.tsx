import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import myStateApp from "./stateApp";
import {json} from "./features";

import {DialogCreateFeatureF} from "./dialog/DialogCreateFeature";
import App2 from "./App2";
import App3 from "./App3";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>

      <>
          <div className={"left-menu"}>
              <button onClick={() => {
                  myStateApp.map?.DrawFeatureCollection(json)
              }}>Add Features
              </button>
              <button onClick={() => {
                  console.log(myStateApp.map?.GetBound(true))
              }}>GetBound as json
              </button>

              <button onClick={() => {
                  console.log(myStateApp.map?.GetBound())
              }}>GetBound as object
              </button>
              <button onClick={() => {
                  console.log(myStateApp.map!.GetFeatures(undefined))
              }}>Get all features
              </button>
              <button onClick={() => {
                  myStateApp.map!.RemoveAllFeatures()
              }}>Clear all feature
              </button>

              <button onClick={() => {
                  myStateApp.map!.BuildFeature('Polygon').then(r=>{
                      console.log(r)
                  }).catch(e=>{
                      console.log(e)
                  })
              }}>Create polygon
              </button>

              <button onClick={() => {
                  myStateApp.map!.BuildFeature('Point').then(r=>{
                      console.log(r)
                  }).catch(e=>{
                      console.log(e)
                  })
              }}>Create point
              </button>
              <button onClick={() => {
                  myStateApp.map!.BuildFeature('Circle').then(r=>{
                      console.log(r)
                  }).catch(e=>{
                      console.log(e)
                  })
              }}>Create circle
              </button>
              <button onClick={() => {
                  myStateApp.map!.BuildFeature('LineString').then(r=>{
                      console.log(r)
                  }).catch(e=>{
                      console.log(e)
                  })
              }}>Create lineString
              </button>

              <button onClick={() => {
                  myStateApp.map!.StartEditFeature(myStateApp.currentFeature)
              }}>StartEditFeature
              </button>
              <button onClick={() => {
                  myStateApp.map!.FinishEditFeature()
              }}>FinisEditFeature
              </button>
              <button onClick={() => {
                  myStateApp.map!.Rotation(0.2)
              }}>Rotation 02
              </button>
              <button onClick={() => {
                  myStateApp.map!.Rotation(0)
              }}>Rotation 0
              </button>
              <button onClick={() => {
                  myStateApp.map!.CancelCreate()
              }}>Cancel
              </button>
              <button onClick={() => {
                  myStateApp.map!.Undo()
              }}>Undo
              </button>
              <button onClick={() => {
                  alert(myStateApp.map!.GetCenterFeature(myStateApp.currentFeature))
              }}>Center
              </button>
              <button onClick={() => {
                  DialogCreateFeatureF().then(r => {
                      if (r.mode === '1') {
                          const mFeat = myStateApp.map!.CreateFeature(r.dataBody.g, r.dataBody.c)
                          myStateApp.map!.AddFeatures([mFeat!])
                          console.log(mFeat)
                      }
                  })
              }}>Create Feature
              </button>
              <button onClick={() => {
                  console.log(myStateApp.map!.GetCoordinateFeature(myStateApp.currentFeature))
              }}>Get Coordinate
              </button>
              <button onClick={() => {
                  alert(myStateApp.map!.GetCurrentEPSGProjection())
              }}>CurrentEPSGProjection
              </button>


          </div>
          <div id={'content'}>
              <App/>
          </div>
      </>



    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
