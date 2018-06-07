import loadData from './load-data'
import './pudding-chart/head-to-head'
import scrollama from 'scrollama'
import intersectionObserver from 'intersection-observer'

const scroller = scrollama()

// data
let shadeData = null

// functions
let toggle = null

// selections
const $h2h = d3.selectAll('.h2h')

// part one scrolly selections
const container = d3.selectAll('.scroll-part1')
const graphic = container.select('.scroll-graphic')
const chart = graphic.select('.chart')
const text = container.select('.scroll-text')
const step = text.selectAll('.step')

function setupH2H(){
  const $sel = d3.select(this)
  const comp1 = $sel.at('data-comp1')
  const comp2 = $sel.at('data-comp2')
  const competitors = [comp1, comp2]

  const filtered = shadeData.filter(d => d.brand_short == comp1 || d.brand_short == comp2)

  const chart = $sel.datum(filtered).headToHead()

  toggle = chart.toggle

  scrollResize()
  setupScroll(chart)
}


function scrollResize(){
  const stepHeight = Math.floor(window.innerHeight * 0.8)

  step
    .style('height',`${stepHeight}px`)

  const containerWidth = container.node().offsetWidth

  graphic
    .style('width', `${containerWidth}px`)
    .style('height', `${window.innerHeight}px`)

  const chartMargin = 50
  const textWidth = text.node().offsetWidth
  const chartWidth = graphic.node().offsetWidth - textWidth - chartMargin

  chart
    .style('width', `${chartWidth}px`)
    .style('height', `${Math.floor(window.innerHeight)}px`)

  scroller.resize()
}

function handleStepEnter(response){
  const index = response.index
  toggle(index)
}

function handleContainerEnter(response){
  graphic.classed('is-fixed', true)
  graphic.classed('is-bottom', false)
}

function handleContainerExit(response){
  graphic.classed('is-fixed', false)
  graphic.classed('is-bottom', response.direction === 'down')
}

function setupScroll(){
  scroller.setup({
    container: '.scroll',
    graphic: '.scroll-graphic',
    text: '.scroll-text',
    step: '.step',
    debug: false
  })
  .onStepEnter(handleStepEnter)
  // .onContainerEnter(handleContainerEnter)
  // .onContainerExit(handleContainerExit)
}

function resize() {

  // runs resize function from head-to-head.js
  chart.resize()
  scrollResize()
}



function init() {

  Promise.all([loadData()])
		.then((results) => {
			shadeData = results[0]
			$h2h.each(setupH2H)
		})
		.catch(err => console.log(err))
}

export default { init, resize };
