const elementId = "yoast-measurement-element";

/**
 * Creates an hidden element with the purpose to calculate the sizes of elements and adds these elements to the body.
 *
 * @returns {HTMLElement} The created hidden element.
 */
function createMeasurementElement() {
	const hiddenElement = document.createElement( "div" );

	hiddenElement.id = elementId;

	// Styles to prevent unintended scrolling in Gutenberg.
	hiddenElement.style.position = "absolute";
	hiddenElement.style.left = "-9999em";
	hiddenElement.style.top = 0;
	hiddenElement.style.height = 0;
	hiddenElement.style.overflow = "hidden";
	hiddenElement.style.fontFamily = "arial, sans-serif";
	hiddenElement.style.fontSize = "20px";
	hiddenElement.style.fontWeight = "400";

	document.body.appendChild( hiddenElement );
	return hiddenElement;
}

/**
 * Measures the width of the text using a hidden element.
 *
 * @param {string} text The text to measure the width for.
 * @returns {number} The width in pixels.
 */
export default function measureTextWidth( text ) {
	let element = document.getElementById( elementId );
	if ( ! element ) {
		element = createMeasurementElement();
	}
	element.innerHTML = text;
	return element.offsetWidth;
}
