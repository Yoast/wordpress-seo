/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasClass } from "./filterHelpers";

// These are elements that we don't want to include in the analysis and that can be child nodes of paragraphs or headings.
export const canBeChildOfParagraph = [ "code", "script", "#comment" ];

const permanentFilters = [
	elementHasName( "script" ),
	elementHasName( "style" ),
	elementHasName( "code" ),
	elementHasName( "pre" ),
	elementHasName( "blockquote" ),
	// Filter yoast TOC blocks
	elementHasClass( "yoast-table-of-contents" ),
	// Filter yoast breadcrumbs
	elementHasClass( "yoast-breadcrumbs" ),
	// Filter yoast estimated reading time
	elementHasClass( "yoast-reading-time__wrapper" ),
];

export default permanentFilters;
