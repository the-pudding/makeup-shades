import loadData from './load-data'
import './pudding-chart/brawl'
import scrollama from 'scrollama'
import intersectionObserver from 'intersection-observer'


const scrollers = []

// data
let shadeData = null
let brandDict = null
let groupDict = null
let brandMap = null
let competitorMap = null
let toggle = null

const dispatch = d3.dispatch('switch', 'button')

// selections
const $brawl = d3.selectAll('.comp-brawl')
const $switch = d3.selectAll('.toggle input')
let $buttons = null
let $sel = null

const bipocSelect = null

const compSection = [{
  comp: 'us-best',
  section: 'scroll-us-best'
}, {
  comp: 'poc-marketed',
  section: 'scroll-poc-marketed'
}, {
  comp: 'nigerian-best',
  section: 'scroll-nigeria'
}, {
  comp: 'japanese-best',
  section: 'scroll-japan'
}, {
  comp: 'indian-best',
  section: 'scroll-india'
}]

const compSectionMap = d3.map(compSection, d => d.comp)


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
  const num = competitorMap.get(comp).number

  let filteredShades = null
  if (comp == 'poc-marketed') filteredShades = filterbipoc()
  else filteredShades = filterDataNoDD(comp)

  const thisBrawl = $brawl.select('.brawl')

  const chart = $sel
    .datum(filteredShades)
    .brawl()
    .on({dispatch, event: 'switch'})
    .on({dispatch, event: 'button'})

  toggle = chart.toggle

  setupUI(chart)

  const pageWidth = window.innerWidth
  console.log({pageWidth})

  if (pageWidth >= 1000) {
    // only setup scrollytelling on desktop
    scrollResize()
    setupScroll(chart, comp)
  }

}

function filterbipoc(){
  const filtered = shadeData.filter(d => d.group == 4 || d.group == 0)
  return filtered
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

function handleDropdown(chart, selected){
  const wholeData = shadeData.filter(d => d.group == 3 || d.group == 4 || d.group == 0)

  let selectedData = null

  let section = d3.select('.scroll-poc-marketed')

  let button = section.selectAll('.is-active')

  const comp = button
    .at('data-competitors')

  const action = button
    .at('data-action')

  const slider = section.select('.toggle input')
  const checked = slider.property('checked')

  if (selected === "White") selectedData = wholeData.filter(d => d.group == 4 || d.group == 0)
  if (selected === "BIPOC") selectedData = wholeData.filter(d => d.group == 3 || d.group == 0)
  if (selected === "All") selectedData = wholeData

  chart
    .data(selectedData)
    .render()

  dispatch.call('button', null, { comp, action })
  dispatch.call('switch', null, { comp, checked })
}

function setupUI(chart){
  $switch.on('change', handleSwitch)

  $buttons = $sel.selectAll('.ui-display_button')

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
      .on('change', function(d){
        const selected = this.value
        handleDropdown(chart, selected)
      })
  }
}

function scrollResize(){
  const stepHeight = Math.floor(window.innerHeight * 0.8)

  const graphic = $sel.select('.scroll-graphic')
  const chart = graphic.select('.chart')
  const text = $sel.select('.scroll-text')
  const step = text.selectAll('.step')

  step
    .style('height',`${stepHeight}px`)

  const containerWidth = d3.select('.scroll').node().offsetWidth

  graphic
    .style('width', `${containerWidth}px`)
    .style('height', `${window.innerHeight}px`)

  const chartMargin = 50
  const textWidth = text.node().offsetWidth
  const chartWidth = graphic.node().offsetWidth //- textWidth - chartMargin

  chart
    .style('height', `${Math.floor(window.innerHeight)}px`)

    console.log({containerWidth, chartWidth})

  scrollers.forEach(scroller => scroller.resize())
}



function handleStepEnter(chart, response, section){
  const index = response.index
  const graphic = d3.select(`.${section}`).select('.scroll-graphic')
  const dd = graphic.select('select')

  if (section === 'scroll-poc-marketed'){
    if (index === 0) {
      toggle(section, 1)
      handleDropdown(chart, "White")
      dd.selectAll('option')
        .property('selected', d => d == "White")
    }
    if (index === 1) {
      toggle(section, 1)
      handleDropdown(chart, "BIPOC")
      dd.selectAll('option')
        .property('selected', d => d == 'BIPOC')
    }
  } else toggle(section, index)

}

function handleContainerEnter(response, section){
  const graphic = d3.select(`.${section}`).select('.scroll-graphic')
  graphic.classed('is-fixed', true)
  graphic.classed('is-bottom', false)
}

function handleContainerExit(response, section){
    const graphic = d3.select(`.${section}`).select('.scroll-graphic')
    graphic.classed('is-fixed', false)
    graphic.classed('is-bottom', response.direction === 'down')
}

function setupScroll(chart, comp){
  const section = compSectionMap.get(comp).section
  const scroller = scrollama()
  scroller.setup({
    container: `.${section}`,
    graphic: `.${section} .scroll-graphic`,
    text: '.scroll-text',
    step:  `.${section} .step`,
    debug: false
  })
  //.onStepEnter(handleStepEnter)
  .onStepEnter((response, s) => handleStepEnter(chart, response, section))
  // .onContainerEnter((response, s) => handleContainerEnter(response, section))
  // .onContainerExit((response, s) => handleContainerExit(response, section))

  scrollers.push(scroller)
}

function resize(){
  chart.resize()
  scrollResize()
}

function init() {

  Promise.all([loadData()])
		.then((results) => {
			shadeData = results[0]
			$brawl.each(setupBrawl)
		})
		.catch(err => console.log(err))
}

export default { init, resize };
