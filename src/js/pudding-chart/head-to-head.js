/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.headToHead = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
        console.log({data})
				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

				return Chart;
			},
			// update scales and render chart
			render() {
          const nested = d3.nest()
            .key(d => d.lightnessGroup)
            .key(e => e.brand_short)
            .entries(data)

          const competitorsDup = data.map(d => d.brand_short)

          const competitors = [...new Set(competitorsDup)]

          // fill in missing values
          const allNested = d3.range(0, 10).map(i => {
            const key = i.toString()
            const match = nested.find(d => d.key === key)
            const comp = competitors.map(d => {
              return {key: d, values:[{}]}
            })
            if (match) return match
            else return {key, values: comp}
          })

        // enter category divs
          const categories = $sel
            .selectAll('.bin-category')
            .data(allNested)
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-category bin-category-${i}`)

            console.log({allNested})

          const brands = categories
            .selectAll('.bin-brand')
            .data(d => {
              if(d != null){
                return d.values
              }
                else return d})
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-brand bin-brand-${i}`)

            console.log({brands})

          const swatches = brands
            .selectAll('.bin-swatch')
            .data(d => {
              const val = d.values
              console.log({val})
              return d.values
            })
            .enter()
            .append('div')
            .attr('class', 'bin-swatch')
            .style('height', `3px`)
            .style('width', `75px`)
            .style('background-color', d => {
              console.log({d})
              return `#${d.hex}`
            })



        //enter update exit goes here
				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
