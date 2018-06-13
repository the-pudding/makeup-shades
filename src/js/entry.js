// D3 is included by globally by default
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import loadData from './load-data'
import graphic from './graphic';
import part1 from './part-1'
import usbest from './part1-usbest'
import spark from './spark-graphic'

const $body = d3.select('body');
let previousWidth = 0;
let previousHeight = window.innerHeight

function resize() {
	// only do resize on width changes, not height
	// (remove the conditional if you want to trigger on height change)
	const width = $body.node().offsetWidth;
	const height = window.innerHeight
	if (previousWidth !== width || height < previousHeight) {
		previousWidth = width;
		graphic.resize();
		usbest.resize()
	}

	usbest.resize()
}

function init() {
	// add mobile class to body tag
	$body.classed('is-mobile', isMobile.any());
	// setup resize event
	window.addEventListener('resize', debounce(resize, 150));
	// kick off graphic code
	graphic.init();
	part1.init()
	usbest.init()
	spark.init()
}

init();
