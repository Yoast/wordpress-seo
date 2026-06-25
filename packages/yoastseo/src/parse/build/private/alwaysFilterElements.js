/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasClass, elementHasID } from "./filterHelpers";

// These are elements that we don't want to include in the analysis and that can be child nodes of paragraphs or headings.
export const canBeChildOfParagraph = [ "code", "kbd", "math", "q", "samp", "script", "var", "#comment", "cite", "form",
	"map", "noscript", "output" ];

const permanentFilters = [
	// Filters out Yoast blocks that don't need to be part of the analysis.
	// The only Yoast blocks that are not filtered out are the FAQ and the How-to block.
	// The other Yoast blocks we want to filter (i.e. Yoast siblings, Yoast subpages, Yoast breadcrumbs and Yoast AI Summary) enter the Paper as HTML comments.
	// Comments are filtered out in `filterBeforeTokenizing.js` step.
	elementHasClass( "yoast-table-of-contents" ),
	elementHasClass( "yoast-reading-time__wrapper" ),
	elementHasClass( "yoast-ai-summarize" ),
	// Filters for Elementor widgets
	elementHasID( "breadcrumbs" ),
	elementHasClass( "elementor-button-wrapper" ),
	// Catches the classic button widget's <a> in Elementor V4, where the elementor-button-wrapper
	// div is absent and the anchor is the first rendered child of the widget wrapper.
	elementHasClass( "elementor-button" ),
	elementHasClass( "elementor-divider" ),
	elementHasClass( "elementor-spacer" ),
	elementHasClass( "elementor-custom-embed" ),
	elementHasClass( "elementor-icon-wrapper" ),
	// Filter only the icon container inside the icon-box widget, not the wrapper that also holds
	// the title and description text. The old elementor-icon-box-wrapper filter was too wide and
	// silently removed the heading and description from analysis.
	elementHasClass( "elementor-icon-box-icon" ),
	elementHasClass( "elementor-counter" ),
	elementHasClass( "elementor-progress-wrapper" ),
	// This element is used for the progress bar widget title.
	elementHasClass( "elementor-title" ),
	elementHasClass( "elementor-alert" ),
	elementHasClass( "elementor-soundcloud-wrapper" ),
	elementHasClass( "elementor-shortcode" ),
	elementHasClass( "elementor-menu-anchor" ),
	elementHasClass( "e-rating" ),
	// Elementor's own table-of-contents widget (distinct from the Yoast block above). It is
	// navigation rather than content, so it is excluded in both the classic and V4 editors.
	elementHasClass( "elementor-widget-table-of-contents" ),
	// Elementor V4 atomic widgets that are not body content. Atomic forms render as a `<form>`
	// element and are already covered by the `form` filter below, including their nested fields.
	elementHasClass( "elementor-widget-e-button" ),
	elementHasClass( "elementor-widget-e-divider" ),
	elementHasClass( "elementor-widget-e-svg" ),
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
	elementHasName( "#comment" ),
	elementHasName( "cite" ),
	elementHasName( "form" ),
	elementHasName( "map" ),
	elementHasName( "noscript" ),
	elementHasName( "output" ),
];

export default permanentFilters;
