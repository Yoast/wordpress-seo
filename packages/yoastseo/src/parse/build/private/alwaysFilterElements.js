/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasDataType, elementHasID } from "./filterHelpers";

// These are elements that we don't want to include in the analysis and that can be child nodes of paragraphs or headings.
export const canBeChildOfParagraph = [ "code", "script", "#comment" ];

const permanentFilters = [
	// Filters out Yoast blocks that don't need to be part of the analysis.
	// The only Yoast blocks that are not filtered out are the FAQ and the How-to block.
	elementHasDataType( "yoast-seo/table-of-contents" ),
	elementHasDataType( "yoast-seo/breadcrumbs" ),
	elementHasDataType( "yoast-seo/estimated-reading-time" ),
	elementHasDataType( "yoast-seo/siblings" ),
	elementHasDataType( "yoast-seo/subpages" ),
	// Filters for the Elementor widget Yoast Breadcrumbs.
	elementHasID( "breadcrumbs" ),
	// Filters out HTML elements.
	/* Elements are filtered out when: they contain content outside of the author's control (incl. quotes and embedded
	content); their content isn't natural language (e.g. code); they contain metadata hidden from the page visitor
	(e.g. <style>); they are used to accept input from the visitor. Deprecated HTML elements are not included.*/
	elementHasName( "base" ),
	elementHasName( "blockquote" ),
	elementHasName( "canvas" ),
	elementHasName( "code" ),
	// It seems that the <head> element is filtered out by the parser we employ, but it's included here for completeness.
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
