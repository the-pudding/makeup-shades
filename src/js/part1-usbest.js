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

const dispatch = d3.dispatch('switch')

// selections
const $brawl = d3.selectAll('.brawl')
const $switch = d3.selectAll('.toggle input')
const $buttons = d3.selectAll('.ui-display_button')

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
    .on({dispatch, event: 'switch'})

  setupUI()
}

function handleSwitch(){

  const comp = d3.select(this)
    .at('data-competitors')

  const { checked } = this
  console.log({comp, checked})
  dispatch.call('switch', null, { comp, checked })
}

function handleClick(){
  const button = d3.select(this)

  $buttons
    .classed('is-active', false)

  button
    .classed('is-active', true)

  const comp = button
    .at('data-competitors')

  const action = button
    .at('data-action')

  console.log({comp, action})
}

function setupUI(){
  $switch.on('change', handleSwitch)

  $buttons.on('click', handleClick)
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
