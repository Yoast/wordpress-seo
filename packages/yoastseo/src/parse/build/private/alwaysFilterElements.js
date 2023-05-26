/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasClass } from "./filterHelpers";

const permanentFilters = [
	elementHasName( "script" ),
	elementHasName( "style" ),
	elementHasName( "code" ),
	elementHasName( "blockquote" ),
	// Filter yoast TOC blocks
	elementHasClass( "yoast-table-of-contents" ),
	// Filter yoast breadcrumbs
	elementHasClass( "yoast-breadcrumbs" ),
	// Filter yoast estimated reading time
	elementHasClass( "yoast-reading-time__wrapper" ),
];

export default permanentFilters;
