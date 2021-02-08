import * as d3 from 'd3'

export const getRandomIdx = (min, max) => 
    Math.round(Math.random() * (max - min) + min);

export const dateParser = d3.timeParse('%Y-%m-%d %H:%M:%S')