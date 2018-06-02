/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.brawl = function init(options) {
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
				width = Math.floor(($sel.node().offsetWidth - marginLeft - marginRight) * 0.6)

				height = $sel.node().offsetHeight - marginTop - marginBottom;

        $sel
          .style('width', `${width}px`)

        console.log({width, marginLeft, marginRight})
				return Chart;
			},
			// update scales and render chart
			render() {
        const nested = d3.nest()
          .key(e => e.product_short)
          .key(d => d.lightnessGroup)
          .entries(data)

        const brandCounts = d3.nest()
          .key(d => d.product_short)
          .rollup(e => e.length)
          .entries(data)

          const countMap = d3.map(brandCounts, d => d.key)

          const brandMap = d3.map(data, d => d.product_short)

          let lightnessGroups = []

          // fill in missing values
          const allNested = nested.map(e => {
            const f = e.values
            lightnessGroups.push(f)
            const updatedVal = d3.range(0, 10).map(i => {
              const key = i.toString()
              const match = f.find(d => d.key === key)

              if (match) return match
              else return {key, values: []}
            })
            return {key: e.key, values: updatedVal}
          })

          // enter category divs
          const brands = $sel
            .selectAll('.bin-brand')
            .data(allNested)
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-brand bin-brand-${i}`)
            .attr('data-brand', (d, i) => i)

          // adding column headers
          const brandTitleGroup = brands
            .selectAll('.bin-brandTGroup')
            .data(d => [d])
            .enter()
            .append('div')
            .attr('class', 'bin-brandTGroup')

          brandTitleGroup
              .append('text')
              .text(d => brandMap.get(d.key).brand)
              .attr('class', 'tk-atlas bin-brandTitle')

          brandTitleGroup
            .append('text')
            .text(d => {
              const product = brandMap.get(d.key).product
              const count = `${countMap.get(d.key).value} shades`
              return `${product} • ${count}`
            })
            .attr('class', 'tk-atlas bin-brandProduct')

          brandTitleGroup
            .append('text')
            .text(d => `${countMap.get(d.key).value} shades`)
            .attr('class', 'tk-atlas bin-brandTotal')

          // adding lightness categories spread class goes here
          const categories = brands
            .selectAll('.bin-category')
            .data(d => {
              const val = d.values
              console.log({val})
              return val
            })
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-category bin-category-${i}`)


          const swatchGroup = categories
            .selectAll('.bin-swatchGroup')
            .data(d => [d])
            .enter()
            .append('div')
            .attr('class', 'bin-swatchGroup')

          // Fix height value of this on toggle
          const swatches = swatchGroup
            .selectAll('.bin-swatch')
            .data(d => d.values)
            .enter()
            .append('div')
            .attr('class', d => `bin-swatch bin-swatch-${d.L}`)
            .style('height', `8px`)
            .style('width', `8px`)
            .style('background-color', d => `#${d.hex}`)


            // Setting up label divs

            const labelGroup = $sel
              .selectAll('.bin-labelGroup')
              .data([0])
              .enter()
              .append('div')
              .attr('class', 'bin-labelGroup')

            const labelTitleGroup = labelGroup
              .append('div')
              .attr('class', 'bin-labelTGroup')

            const labelTitle = labelTitleGroup
              .selectAll('.bin-labelTitle')
              .data(['Lightness', 'Range'])
              .enter()
              .append('text')
              .text(d => d)
              .attr('class', 'tk-atlas bin-labelTitle')


            const labelCat = labelGroup
              .selectAll('.bin-labelCat')
              .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
              .enter()
              .append('div')
              .attr('class', 'bin-labelCat')

            const label = labelCat
              .selectAll('.bin-label')
              .data(d => [d])
              .enter()
              .append('text')
              .attr('class', 'tk-atlas bin-label')
              .text(d => `${d * 10} - ${(d * 10) + 10}`)
              .attr('alignment-baseline', 'middle')
              .attr('text-anchor', 'middle')

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
