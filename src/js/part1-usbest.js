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
let chart = null

const dispatch = d3.dispatch('switch', 'button')

// selections
const $brawl = d3.selectAll('.comp-brawl')
const $switch = d3.selectAll('.toggle input')
let $buttons = null
let $sel = null

const bipocSelect = null


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
  $sel = d3.select(this)
  const comp = $sel.at('data-competitors')

  const filteredShades = filterDataNoDD(comp)

  const thisBrawl = $brawl.select('.brawl')

  chart = $sel
    .datum(filteredShades)
    .brawl()
    .on({dispatch, event: 'switch'})
    .on({dispatch, event: 'button'})

  setupUI()
}

function filterDataNoDD(comp){
  const filtered = shadeData.filter(d => {
    const num = competitorMap.get(comp).number

    if (num == 3 || num == 4) return d.group == 3 || d.group == 4 || d.group == 0
    else return d.group == num || d.group == 0
  })

  return filtered
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

  const parent = d3.select(this.parentNode)

  const theseButtons = parent.selectAll('.ui-display_button')

  theseButtons
    .classed('is-active', false)

  button
    .classed('is-active', true)

  const comp = button
    .at('data-competitors')

  const action = button
    .at('data-action')

  dispatch.call('button', null, { comp, action })
}

function handleDropdown(){
  const selected = this.value
  const wholeData = shadeData.filter(d => d.group == 3 || d.group == 4 || d.group == 0)

  let selectedData = null

  let button = $sel.selectAll('.is-active')

  const comp = button
    .at('data-competitors')

  const action = button
    .at('data-action')

  const slider = $sel.select('.toggle input')


  const checked = slider.property('checked')


  console.log({slider, checked})

  if (selected === "White") selectedData = wholeData.filter(d => d.group == 4 || d.group == 0)
  if (selected === "BIPOC") selectedData = wholeData.filter(d => d.group == 3 || d.group == 0)
  if (selected === "All") selectedData = wholeData

  chart
    .data(selectedData)
    .render()

  dispatch.call('button', null, { comp, action })
  dispatch.call('switch', null, { comp, checked })
}

function setupUI(){
  $switch.on('change', handleSwitch)

  $buttons = $sel.selectAll('.ui-display_button')
  console.log({$sel})

  $buttons.on('click', handleClick)

  const shades = $sel.select('#shades')
    .classed('is-active', true)

  const shadeGroups = $sel.selectAll('.bin-swatchGroup')
    .classed('is-visible', true)

  // drop down only for bipoc
  if ($sel.classed('scroll-poc-marketed')){
    const dd = $sel.select('select')

    const options = ['White', 'BIPOC', 'All']

    dd
      .selectAll('option')
      .data(options)
      .enter()
      .append('option')
      .attr('value', d => d)
      .text(d => d)
      .property('selected', d => d == 'White')

    dd
      .on('change', handleDropdown)
  }
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
