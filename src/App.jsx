import React, { useState, useEffect, useRef } from "react"
import { readCounts } from './utils/countsData'
import { readSales } from './utils/salesData'

import Timeline from "./vizComponents/Timeline"
import ScatterPlot from "./vizComponents/ScatterPlot"
import Histogram from "./vizComponents/Histogram"

import "./styles.css"

const dateAccessor = d => d.date
const revenueAccesor = d => d.revenue

const ingressAccessor = d => d.num_ingress
const transitAccessor = d => d.num_transit

const getData = async () => ({
  timeline: await readSales(),
  scatter: await readCounts(),
})

const App = () => {

  const [data, setData] = useState({timeline: [], scatter: []})

  useEffect(async () => setData(await getData()), []);
  useInterval(async () => setData(await getData()), 2000)

  return (
    <div className="App">
      <h1>
        Dashboard Centro Comercial
      </h1>
      <div className="App__charts">
        <Timeline
          data={data.timeline}
          xAccessor={dateAccessor}
          yAccessor={revenueAccesor}
          label="Recaudación"
        />
        <ScatterPlot
          data={data.scatter}
          xAccessor={ingressAccessor}
          yAccessor={transitAccessor}
          xLabel="Ingreso"
          yLabel="Tránsito"
        />
        <Histogram
          data={data.timeline}
          xAccessor={revenueAccesor}
          label="Recaudación"
        />
      </div>
    </div>
  )
}

export default App


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}