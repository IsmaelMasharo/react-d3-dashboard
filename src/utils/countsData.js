import * as d3 from "d3"
import counts from '../data/counts.csv'
import { getRandomIdx, dateParser } from './helpers'

const parseCounts = data =>  {
  // TODO: dynamic filters
  const filteredAreaId = 220
  const countTextData = d3.csvFormat(data)

  const parseData = d3.csvParse(countTextData, ( {date, ...rest} ) => {
    const parsedDate = dateParser(date);
    return {
      date: parsedDate,
      day: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
      ...d3.autoType(rest)
    }
  })

  return parseData
    .sort((a, b) => d3.ascending(a.date, b.date))
    .filter(d => d.area_id === filteredAreaId)
}

export async function readCounts() {

  // Access data
  const countsData = await d3.csv(counts)
  const parsedCounts = parseCounts(countsData)

  
  const subsetSize = 5
  const randIdx = getRandomIdx(0, parsedCounts.length - subsetSize)
  const subset = parsedCounts.slice(randIdx, randIdx + subsetSize)
  
  return subset
}