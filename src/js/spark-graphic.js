import loadData from './load-data'
import './pudding-chart/spark'

// data
let shadeData = null

// functions
let toggle = null

// selections
const $spark = d3.selectAll('.spark')

function setupSpark(){
  const $sel = d3.select(this)
  const group = $sel.at('data-groups')

  const filtered = shadeData.filter(d => {
    if(group == 'us'){
      return d.group == 0 || d.group == 2 || d.group == 3 || d.group == 4
    } else if (group == 'world') {
      return d.group == 2 || d.group == 5 || d.group == 6 || d.group == 7
    }
  })

  const charts = $sel
    .datum(filtered)
    .spark()
}

function resize() {
  // runs resize function from head-to-head.js
  chart.resize()
}



function init() {

  Promise.all([loadData()])
		.then((results) => {
			shadeData = results[0]
			$spark.each(setupSpark)
		})
		.catch(err => console.log(err))
}

export default { init, resize };
