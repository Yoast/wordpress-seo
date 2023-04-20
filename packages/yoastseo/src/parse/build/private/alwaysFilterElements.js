/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasClass } from "./filterHelpers";

const permanentFilters = [
	// Filters Yoast TOC block.
	elementHasClass( "yoast-table-of-contents" ),
	// Filters Yoast breadcrumbs block.
	elementHasClass( "yoast-breadcrumbs" ),
	// Filters Yoast estimated reading time block.
	elementHasClass( "yoast-reading-time__wrapper" ),
	// Filters HTML elements.
	/* Elements are filtered out when they contain content outside of the author's control (incl. quotes and embedded
	content), when their content isn't natural language (e.g. code), when they contain metadata hidden from the page
	visitor (e.g. style) or they are used to accept input from the visitor. Deprecated elements are not included.*/
	elementHasName( "base" ),
	elementHasName( "blockquote" ),
	elementHasName( "canvas" ),
	elementHasName( "code" ),
	elementHasName( "head" ),
	elementHasName( "iframe" ),
	elementHasName( "input" ),
	elementHasName( "kbd" ),
	elementHasName( "link" ),
	elementHasName( "math" ),
	elementHasName( "meta" ),
	elementHasName( "meter" ),
	elementHasName( "noscript" ),
	elementHasName( "object" ),
	elementHasName( "portal" ),
	elementHasName( "pre" ),
	elementHasName( "progress" ),
	elementHasName( "q" ),
	elementHasName( "samp" ),
	elementHasName( "script" ),
	elementHasName( "slot" ),
	elementHasName( "style" ),
	elementHasName( "svg" ),
	elementHasName( "template" ),
	elementHasName( "textarea" ),
	elementHasName( "title" ),
	elementHasName( "var" ),
];

export default permanentFilters;
