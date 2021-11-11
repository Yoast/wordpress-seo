import { addFilter } from "@wordpress/hooks";

const MEASUREMENT_ELEMENT_ID = "yoast-measurement-element";

/**
 * Creates an hidden element with the purpose to calculate the sizes of elements and adds these elements to the body.
 *
 * @param {string} [elementId] The ID of the HTML element.
 *
 * @returns {HTMLElement} The created hidden element.
 */
const createMeasurementElement = ( elementId = MEASUREMENT_ELEMENT_ID ) => {
	const hiddenElement = document.createElement( "div" );

	hiddenElement.id = elementId;
	hiddenElement.style.position = "absolute";
	hiddenElement.style.left = "-9999em";
	hiddenElement.style.top = "0";
	hiddenElement.style.height = "0";
	hiddenElement.style.overflow = "hidden";
	hiddenElement.style.fontFamily = "arial, sans-serif";
	hiddenElement.style.fontSize = "18px";
	hiddenElement.style.fontWeight = "400";

	document.body.appendChild( hiddenElement );

	return hiddenElement;
};

/**
 * Measures the width of the text, using a hidden element.
 *
 * @param {string} text The text to measure the width for.
 * @param {string} [elementId] The ID of the HTML element.
 *
 * @returns {number} The width in pixels.
 */
const measureTextWidth = ( text, elementId = MEASUREMENT_ELEMENT_ID ) => {
	let element = document.getElementById( elementId );
	if ( ! element ) {
		element = createMeasurementElement();
	}

	element.innerHTML = text;

	return element.offsetWidth;
};

const measureSeoTitleWidth = paper => ( {
	...paper,
	seoTitleWidth: measureTextWidth( paper.seoTitle ),
} );

const registerSeoTitleWidth = () => {
	// Prio of 11, because no replacevars are used in the SEO title width.
	addFilter(
		"yoast.seoStore.analysis.preparePaper",
		"yoast/seo-integration-app/measureSeoTitleWidth",
		measureSeoTitleWidth,
		11,
	);
};

export default registerSeoTitleWidth;
