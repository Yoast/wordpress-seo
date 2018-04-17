import * as importedData from "@wordpress/data";
import * as importedElement from "@wordpress/element";
import get from "lodash/get";

let element = get( window, "wp.element", null );
let data = get( window, "wp.data", null );

// If Gutenberg is present we can just use their wp.element and wp.data.
if ( element === null ) {
	element = importedElement;
}

if ( data === null ) {
	data = importedData;
}

// Create our own global.
const yoast = window.yoast || {};

// Back port all wp globals on our own private `_wp` for isolation.
yoast._wp = {
	element,
	data,
};

// Put is all actually on the global.
window.yoast = yoast;
