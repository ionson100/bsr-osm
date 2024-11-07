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
              <button onClick={() => {
                  myStateApp.map?.DrawFeatureCollection(json)
              }}>Add Features
              </button>
              <button onClick={() => {
                  console.log(myStateApp.map?.getBound(true))
              }}>GetBound as json
              </button>

              <button onClick={() => {
                  console.log(myStateApp.map?.getBound())
              }}>GetBound as object
              </button>
              <button onClick={() => {
                  console.log(myStateApp.map!.getFeatures())
              }}>Get all features
              </button>
              <button onClick={() => {
                  myStateApp.map!.removeAllFeatures()
              }}>Clear all feature
              </button>

              <button onClick={() => {
                  myStateApp.map!.CreatePolygon()
              }}>Create polygon
              </button>

              <button onClick={() => {
                  myStateApp.map!.CreatePoint()
              }}>Create point
              </button>
              <button onClick={() => {
                  myStateApp.map!.CreateCircle()
              }}>Create circle
              </button>
              <button onClick={() => {
                  myStateApp.map!.CreateRoute()
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
