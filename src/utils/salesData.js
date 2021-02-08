import * as d3 from "d3"
import sales from '../data/sales.csv'
import { getRandomIdx, dateParser } from './helpers'

const parseSales = data =>  {
  // TODO: dynamic filters
  const filteredSSTenantId = 90
  const filteredVenueId = 11457

  const dataAsText = d3.csvFormat(data)

  const parseData = d3.csvParse(dataAsText, ( {date, ...rest} ) => {
    const parsedDate = dateParser(date);
    return {
      date: parsedDate,
      day: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
      ...d3.autoType(rest)
    }
  })

  return parseData
    .sort((a, b) => d3.ascending(a.date, b.date))
    .filter(d => d.ss_tenant_id === filteredSSTenantId && d.venue_id === filteredVenueId)
}

export async function readSales() {

  // Access data
  const salesData = await d3.csv(sales)
  const parsedSales = parseSales(salesData)

  // Aggregate data: num_sales by date
  let aggSales = d3.rollups(
    parsedSales, 
    group => d3.sum(group, d => d.num_sales), 
    d => d.day
  ).map(([date, revenue]) => ({ date, revenue }))

  const subsetSize = 10
  const randIdx = getRandomIdx(0, aggSales.length - subsetSize)
  const subset = aggSales.slice(randIdx, randIdx + subsetSize)

  return subset
}