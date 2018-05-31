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
            .key(e => e.brand_short)
            .key(d => d.lightnessGroup)
            .entries(data)

          const brandCounts = d3.nest()
            .key(d => d.brand_short)
            .rollup(e => e.length)
            .entries(data)

          const countMap = d3.map(brandCounts, d => d.key)

          const brandMap = d3.map(data, d => d.brand_short)

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

        const lightness1 = lightnessGroups[0]
        const lightness2 = lightnessGroups[1]
        const allLightness = lightness1.concat(lightness2)

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
              .text(d => brandMap.get(d.key).product)
              .attr('class', 'tk-atlas bin-brandProduct')

            brandTitleGroup
              .append('text')
              .text(d => `${countMap.get(d.key).value} shades`)
              .attr('class', 'tk-atlas bin-brandTotal')

          // adding lightness categories
          const categories = brands
            .selectAll('.bin-category')
            .data(d => d.values)
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-category spread bin-category-${i}`)

          const swatchGroup = categories
            .selectAll('.bin-swatchGroup')
            .data(d => [d])
            .enter()
            .append('div')
            .attr('class', 'bin-swatchGroup')

          const swatches = swatchGroup
            .selectAll('.bin-swatch')
            .data(d => d.values)
            .enter()
            .append('div')
            .attr('class', d => `bin-swatch bin-swatch-${d.L}`)
            .style('height', `3px`)
            .style('width', `75px`)
            .style('background-color', d => `#${d.hex}`)

          const counts = categories
            .selectAll('.bin-count')
            .data(d => [d])
            .enter()
            .append('text')
            .attr('data-value', d => d.values.length)
            .attr('data-group', d => d.key)
            .attr('class', (d, i) => {
              const filtered = allLightness.filter(e => e.key == d.key)
              const filtMap = filtered.map(f => {
                const length = f.values.length
                return length
              })
              const maximum = Math.max(...filtMap)

              if (d.values.length == 0) return 'tk-atlas bin-count bin-count-zero'
              else if (d.values.length == maximum) return 'tk-atlas bin-count bin-count-winner'
              else return 'tk-atlas bin-count'
            })
            .text(d => d.values.length)

            // Setting up vs divs

            const vsGroup = $sel
              .selectAll('.bin-vsGroup')
              .data([0])
              .enter()
              .append('div')
              .attr('class', 'bin-vsGroup')

            const vsCat = vsGroup
              .selectAll('.bin-vsCat')
              .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
              .enter()
              .append('div')
              .attr('class', (d, i) => `tk-atlas bin-vsCat bin-vsCat-${d}`)

            const vs = vsCat
              .selectAll('.bin-vs')
              .data(d => [d])
              .enter()
              .append('text')
              .attr('class', (d, i) => `tk-atlas bin-vs bin-vs-${d}`)
              .text('vs')
              .attr('alignment-baseline', 'middle')
              .attr('text-anchor', 'middle')

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
