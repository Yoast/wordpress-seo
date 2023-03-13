/**
 * A config file that contains filters that should always apply.
 */

import { elementHasName } from "./filterHelpers";

const permanentFilters = [
	elementHasName( "script" ),
	elementHasName( "style" ),
	elementHasName( "code" ),
	elementHasName( "blockquote" ),
];

export default permanentFilters;
