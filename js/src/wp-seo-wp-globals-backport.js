import * as importedData from "@wordpress/data";
import * as importedElement from "@wordpress/element";
import * as importedComponents from "@wordpress/components";
import * as styledComponents from "styled-components";

import get from "lodash/get";

/*
 * If Gutenberg is present we can just use their wp.element and wp.data. Otherwise
 * we use the imported objects.
 */
let element = get( window, "wp.element", importedElement );
let data = get( window, "wp.data", importedData );
let components = get( window, "wp.components", importedComponents );

// Create our own global.
const yoast = window.yoast || {};

// Backport all wp globals on our own private `_wp` for isolation.
yoast._wp = {
	element,
	data,
	components,
};

yoast.styledComponents = styledComponents;

// Put it all actually on the global.
window.yoast = yoast;
