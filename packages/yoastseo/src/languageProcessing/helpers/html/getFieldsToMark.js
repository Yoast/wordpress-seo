import { flatten, isUndefined, uniq } from "lodash";
import { getSubheadings } from "./getSubheadings";

/**
 * Gets the part of the html that we want to apply the marking to.
 *
 * @param {array}   marks  The array of mark objects.
 * @param {string}  html   The html of the page where we want to apply the marking to.
 *
 * @returns {{selectedHTML: *[], fieldsToMark: *}} The selected part of the html we want to apply the marking to.
 */
export function getFieldsToMark( marks, html ) {
	const fieldsToMark = uniq( flatten( marks.map( mark => {
		if ( ! isUndefined( mark.getFieldsToMark() ) ) {
			return mark.getFieldsToMark();
		}
	} ) ) );

	const selectedHTML = [];
	fieldsToMark.forEach( field => {
		if ( field === "heading" ) {
			const subheadings = getSubheadings( html );
			subheadings.forEach( subheading => {
				selectedHTML.push( subheading[ 0 ] );
			} );
		}
	} );
	return { fieldsToMark, selectedHTML };
}
