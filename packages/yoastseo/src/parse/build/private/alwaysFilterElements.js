/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName, elementHasClass, isEstimatedReadingtimetag } from "./filterHelpers";

const permanentFilters = [
	elementHasName( "script" ),
	elementHasName( "style" ),
	elementHasName( "code" ),
	elementHasName( "blockquote" ),
	// Filter yoast TOC blocks
	elementHasClass( "wp-block-yoast-seo-table-of-contents yoast-table-of-contents" ),
	isEstimatedReadingtimetag(),
];

export default permanentFilters;
