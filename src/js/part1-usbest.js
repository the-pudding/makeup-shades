import loadData from './load-data'
import './pudding-chart/brawl'
import scrollama from 'scrollama'


const scroller = scrollama()

// data
let shadeData = null
let brandDict = null
let groupDict = null
let brandMap = null
let competitorMap = null

// selections
const $brawl = d3.selectAll('.brawl')

function setupCompetitorMap(){
  const competitors = [{
    number: 0,
    group: 'Fenty'
  },{
    number: 1,
    group: 'Make Up For Ever'
  },{
    number: 2,
    group: 'us-best'
  }, {
    number: 3,
    group: 'poc-created'
  },{
    number: 4,
    group: 'poc-marketed'
  },{
    number: 5,
    group: 'nigerian-best'
  },{
    number: 6,
    group: 'japanese-best'
  },{
    number: 7,
    group: 'indian-best'
  }]

  competitorMap = d3.map(competitors, d => d.group)
}

function setupBrawl(){
  setupCompetitorMap()
  const $sel = d3.select(this)
  const comp = $sel.at('data-competitors')

  const filteredShades = shadeData.filter(d => {
    const num = competitorMap.get(comp).number
    return d.group == num || d.group == 0
  })

  const chart = $brawl
    .datum(filteredShades)
    .brawl()
}

function resize() {}

function init() {

  Promise.all([loadData()])
		.then((results) => {
			shadeData = results[0]
			$brawl.each(setupBrawl)
		})
		.catch(err => console.log(err))
}

export default { init, resize };
