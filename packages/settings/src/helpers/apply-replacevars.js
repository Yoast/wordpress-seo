import { createReplacevarFunctions } from "@yoast/admin-ui-toolkit/helpers";
import { omit, isArray } from "lodash";
import * as replacevars from "../config/replacevars";

/**
 * Gets the replacement variables for a scope.
 *
 * @param {ReplacevarOptions} replacevarOptions The replacevar options.
 *
 * @returns {object[]} The list of replacement variables for the given scope.
 */
const getReplacevars = ( replacevarOptions ) => {
	// Prevent multiple replacevars of the same type.
	let scopedReplacevars = omit( replacevars, [ "titles" ] );
	switch ( replacevarOptions.scope ) {
		case "searchPages":
		case "notFoundPages":
			scopedReplacevars.title = replacevars.titles[ replacevarOptions.scope ];
			break;
		default:
			scopedReplacevars.title = replacevars.titles.title;
			break;
	}
	scopedReplacevars = Object.values( scopedReplacevars );

	// Further filter the replacevars due to the scope being configurable.
	if ( isArray( replacevarOptions.supportedVariables ) ) {
		return scopedReplacevars.filter(
			replacevar => replacevarOptions.supportedVariables.includes( replacevar.name ),
		);
	}

	return scopedReplacevars;
};

export const {
	getReplacevarsForEditor,
	applyReplacevars,
} = createReplacevarFunctions( getReplacevars );
