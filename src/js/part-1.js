import './pudding-chart/head-to-head';

// data
let shadeData = null
let brandDict = null
let groupDict = null

let brandMap = null
let binGenerator = d3.histogram()
  .domain([0, 100])
  .thresholds(9)
  .value(d => d.L)

let bins = null

// selections
const $h2h = d3.selectAll('.h2h')

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

  bins = binGenerator(filtered)

  console.log({filtered})

  const chart = $sel.datum(filtered).headToHead()

  //generateElements($sel, filtered, competitors)
}

function generateElements(selection, filData, competitors){
  const categories = selection
    .selectAll('.bin-category')
    .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .enter()
    .append('div')
    .attr('class', (d, i) => `bin-category, bin-category-${i}`)

  const comp1Fil = shadeData.filter(d => d.brand_short == competitors[0])
  const comp2Fil = shadeData.filter(d => d.brand_short == competitors[1])

  const comp1Bin = binGenerator(comp1Fil)
  const comp2Bin = binGenerator(comp2Fil)

  const nested = d3.nest()
    .key(d => d.brand_short)
    .rollup(e => {
      const brandBin = binGenerator(e)
      return brandBin
    })
    .entries(filData)
    console.log({nested})

  const brands = categories
    .selectAll('.bin-brand')
    .data(nested)
    .enter()
    .append('div')
    .attr('class', (d, i) => `bin-brand bin-brand-${i}`)

  const swatches = brands
    .selectAll('.bin-swatch')
    .data(d => d.value)
    .enter()
    .append('div')
    .attr('class', 'bin-swatch')

    console.log({brands, swatches})

  // const test = valMap.get(35).hex
  // console.log({valMap})
  //
  // const swatches = categories
  //   .selectAll('.bin-swatch')
  //   .data(d => {
  //     const hex = valMap.get(d).hex
  //   })
  //   .enter()
  //   .append('div')
  //   .attr('class', (d, i) => `bin-swatch bin-swatch-${i}`)
}



function resize() {
  // runs resize function from head-to-head.js
  chart.resize()
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
