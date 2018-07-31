import * as importedData from "@wordpress/data";
import * as importedElement from "@wordpress/element";
import { Slot, Fill, SlotFillProvider } from "@wordpress/components";
import get from "lodash/get";

window.lodash = _.noConflict();

/*
 * If Gutenberg is present we can just use their wp.element and wp.data. Otherwise
 * we use the imported objects.
 */
let element = get( window, "wp.element", importedElement );
let data = get( window, "wp.data", importedData );

// Create our own global.
const yoast = window.yoast || {};

// Backport all wp globals on our own private `_wp` for isolation.
yoast._wp = {
	element,
	data,
	components: {
		Slot,
		Fill,
		SlotFillProvider,
	},
};

// Put it all actually on the global.
window.yoast = yoast;
