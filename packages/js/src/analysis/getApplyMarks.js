/* global tinyMCE */
import { noop } from "lodash-es";
import { select } from "@wordpress/data";
import * as tinyMCEHelper from "../lib/tinymce";
import { tinyMCEDecorator } from "../decorator/tinyMCE";
import { isAnnotationAvailable, applyAsAnnotations } from "../decorator/gutenberg";

let decorator = null;

/**
 * Applies the given marks to the content.
 *
 * @param {Paper}    paper The paper.
 * @param {Object[]} marks The marks.
 *
 * @returns {void}
 */
function applyMarks( paper, marks ) {
	if ( tinyMCEHelper.isTinyMCEAvailable( tinyMCEHelper.tmceId ) ) {
		if ( null === decorator ) {
			decorator = tinyMCEDecorator( tinyMCE.get( tinyMCEHelper.tmceId ) );
		}

		decorator( paper, marks );
	}

	if ( isAnnotationAvailable() ) {
		applyAsAnnotations( paper, marks );
	}
}

/**
 * Gets the applyMarks or empty function depending on the marksButtonStatus.
 *
 * @returns {Function} The marker function or an empty function.
 */
export default function getApplyMarks() {
	const showMarkers = select( "yoast-seo/editor" ).isMarkingAvailable();

	if ( ! showMarkers ) {
		return noop;
	}

	return applyMarks;
}
