import './pudding-chart/head-to-head'
import scrollama from 'scrollama'

const scroller = scrollama()

// data
let shadeData = null
let brandDict = null
let groupDict = null

let brandMap = null

// selections
const $h2h = d3.selectAll('.h2h')

// part one scrolly selections
const container = d3.selectAll('.scroll-part1')
const graphic = container.select('.scroll-graphic')
const chart = graphic.select('.chart')
const text = container.select('.scroll-text')
const step = text.selectAll('.step')


function loadDictionaries(){
  console.log("loadDictionaries ran")
  const path = 'assets/data'
  const names = ['brand_dictionary', 'group_dictionary']
  const files = names.map(d => `${path}/${d}.csv`)

  return new Promise((resolve, reject) => {
    d3.loadData(...files, (err, response) => {
      if (err) reject(err)
      else resolve(response)
    })
  })
}

function setupDictionaries(response){
  brandDict = response[0]
  groupDict = response[1]

  brandMap = d3.map(brandDict, d => {
    return d.brand_short
  })
}

function findProduct(brand, product){

  const specificProducts = brandDict.filter(d => d.brand_short == brand)

  const productMap = d3.map(specificProducts, d => {
    return d.foundation_short
  })

  const wantedProduct = productMap.get(product).foundation

  return wantedProduct
}

function defineBin(value){
  switch(true){
    // Lightness > 90
    case value >= 90:
      return 9;
      break;
    // Lightness < 90 but > 80
    case value >= 80:
      return 8;
      break;
    // Lightness < 80 but > 70
    case value >= 70:
      return 7;
      break;
    //Lightness < 70 but > 60
    case value >= 60:
      return 6;
      break;
    case value >= 50:
      return 5;
      break;
    case value >= 40:
      return 4;
      break;
    case value >= 30:
      return 3;
      break;
    case value >= 20:
      return 2;
      break;
    case value >= 10:
      return 1;
      break;
    default:
      return 0
  }
}


function loadShades(){
  const file = 'assets/data/shades.csv'
  d3.loadData(file, setupShades)
}

function setupShades(err, response){
  shadeData = cleanData(response[0])

  console.log({shadeData})

  $h2h.each(setupH2H)
}

function categorizeLightness(){

}

function cleanData(data){
  return data.map(d => ({
    ...d,
    brand_short: d.brand,
    brand: brandMap.get(d.brand).brand,
    product_short: d.product,
    product: findProduct(d.brand, d.product),
    hex: d.hex,
    H: +d.H,
    S: +d.S,
    V: +d.V,
    L: +d.L,
    group: d.group,
    lightnessGroup: defineBin(+d.L)
  }))
}

function setupH2H(){
  const $sel = d3.select(this)
  const comp1 = $sel.at('data-comp1')
  const comp2 = $sel.at('data-comp2')
  const competitors = [comp1, comp2]

  const filtered = shadeData.filter(d => d.brand_short == comp1 || d.brand_short == comp2)

  const chart = $sel.datum(filtered).headToHead()

  chart.toggle()

  scrollResize()
  setupScroll()

  //generateElements($sel, filtered, competitors)
}


function scrollResize(){
  const stepHeight = Math.floor(window.innerHeight * 0.75)

  step
    .style('height',`${stepHeight}px`)

  const bodyWidth = d3.select('body').node().offsetWidth

  graphic
    .style('width', `${bodyWidth}px`)
    .style('height', `${window.innerHeight}px`)

  const chartMargin = 32
  const textWidth = text.node().offsetWidth
  const chartWidth = graphic.node().offsetWidth - textWidth - chartMargin

  chart
    .style('width', `${chartWidth}px`)
    .style('height', `${Math.floor(window.innerHeight)}px`)

  scroller.resize()
}

function handleStepEnter(response){
  // step things go here
  console.log({response})
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
  .onContainerEnter(handleContainerEnter)
  .onContainerExit(handleContainerExit)
}

function resize() {

  // runs resize function from head-to-head.js
  chart.resize()
  scrollResize()
}


function handleError(error){
	console.error(error)
}

function init() {
  loadDictionaries()
    .then(response => {
      setupDictionaries(response)
      loadShades()
    })
    .catch(handleError)
}

export default { init, resize };
