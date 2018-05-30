import './pudding-chart/head-to-head';

// data
let shadeData = null
let brandDict = null
let groupDict = null

let brandMap = null

function cleanData(data){
  return data.map(d => ({
    ...d,
    brand: brandMap.get(d.brand).brand,
    product: findProduct(d.brand, d.product),
    hex: d.hex,
    H: +d.H,
    S: +d.S,
    V: +d.V,
    L: +d.L,
    group: d.group
  }))
}

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



function loadShades(){
  const file = 'assets/data/shades.csv'
  d3.loadData(file, setupShades)
}

function resize() {}

function setupShades(err, response){
  shadeData = cleanData(response[0])
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
