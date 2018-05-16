var templates = require( "./../templates.js" );
var hiddenElement = templates.hiddenSpan;

/**
 * Creates elements with the purpose to calculate the sizes of elements and puts these elements to the body.
 *
 * @returns {void}
 */
const createMeasurementElements = function() {
	let metaDescriptionElement, spanHolder;
	metaDescriptionElement = hiddenElement(
		{
			width: document.getElementById( "meta_container" ).offsetWidth + "px",
			whiteSpace: "",
		}
	);

	spanHolder = document.createElement( "div" );

	// Styles to prevent unintended scrolling in Gutenberg.
	spanHolder.style.position = "absolute";
	spanHolder.style.left = "-9999em";
	spanHolder.style.top = 0;
	spanHolder.style.height = 0;
	spanHolder.style.overflow = "hidden";

	spanHolder.className = "yoast-measurement-elements-holder-2342334";

	spanHolder.innerHTML = metaDescriptionElement;

	document.body.appendChild( spanHolder );

	// this.element.measurers.metaHeight = spanHolder.childNodes[ 0 ];
};

export default createMeasurementElements
