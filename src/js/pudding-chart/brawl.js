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
		const $selGroup = d3.select(el);
    const $sel = $selGroup.select('.brawl')
		let data = $sel.datum();

    let bipoc = false

		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

    let competitors = null
    let competitorMap = null

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

    const events = {
      switch: ({ comp, checked }) => {

        if (comp === competitors) {
          $sel.selectAll('.bin-brand-pf')
            .classed('is-visible', checked)
        }
      },
      button: ({ comp, action }) => {
        if (comp === competitors) {
          let nonGroup = null
          if (action === 'swatch') nonGroup = 'num'
          if (action === 'num') nonGroup = 'swatch'

          $sel.selectAll(`.bin-${nonGroup}Group`)
            .classed('is-visible', false)

          $sel.selectAll(`.bin-${action}Group`)
            .classed('is-visible', true)
        }
      }
    }

		// helper functions

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
        group: 'poc-marketed'
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

      competitorMap = d3.map(competitors, d => d.number)
    }

		const Chart = {
			// called once at start
			init() {
        setupCompetitorMap()
				Chart.resize();
				Chart.render();
        const notFenty = data.filter(d => d.group != 0)
        const first = notFenty[0].group
        competitors = competitorMap.get(+first).group

        const test = $sel.classed('brawl-pocMarketed')

        console.log({$sel, test})

        if ($sel.classed('brawl-pocMarketed')) bipoc = true
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = Math.floor(($sel.node().offsetWidth - marginLeft - marginRight) * 0.6)

				height = $sel.node().offsetHeight - marginTop - marginBottom;

				return Chart;
			},
			// update scales and render chart
			render() {
        const nested = d3.nest()
          .key(e => e.product_short)
          .rollup(leaves => {
            const total = leaves.length
            const group = d3.nest()
              .key(d => d.lightnessGroup)
              .entries(leaves)

              return {total: total, group: group}
          })
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
            const total = e.value.total
            const f = e.value.group
            lightnessGroups.push(f)
            const updatedVal = d3.range(0, 10).map(i => {
              const key = i.toString()
              const match = f.find(d => d.key === key)

              if (match) return match
              else return {key, values: []}
            })
            const bothVal = {total: total, group: updatedVal}
            return {key: e.key, values: bothVal}
          })
            .sort((a, b) => d3.descending(a.values.total, b.values.total))

            $sel.selectAll('.bin-brand').remove()

            // enter category divs
          const brands = $sel
            .selectAll('.bin-brand')
            .data(allNested)
            .enter()
            .append('div')
            .attr('class', (d, i) => `bin-brand bin-brand-${d.key}`)
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
              const count = `${d.values.total} shades`
              return `${product} • ${count}`
            })
            .attr('class', 'tk-atlas bin-brandProduct')

          brandTitleGroup
            .append('text')
            .text(d => `${d.values.total} shades`)
            .attr('class', 'tk-atlas bin-brandTotal')

          // adding lightness categories spread class goes here
          const categories = brands
            .selectAll('.bin-category')
            .data(d => {
              const val = d.values.group
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
            .style('height', `6px`)
            .style('width', `6px`)
            .style('background-color', d => `#${d.hex}`)


            const numGroup = categories
              .selectAll('.bin-numGroup')
              .data(d => [d])
              .enter()
              .append('div')
              .attr('class', 'bin-numGroup')

            const num = numGroup
              .selectAll('.bin-num')
              .data(d => [d])
              .enter()
              .append('text')
              .attr('class', d => {
                const length = d.values.length
                return `bin-num bin-num-${length} tk-atlas`})
              .text(d => {
                const length = d.values.length
                return length
              })


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
			},
			on({ dispatch, event }) {
				dispatch.on(`${event}.${competitors}`, events[event]);
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
