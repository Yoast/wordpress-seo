/* global tinyMCE */
import { isUndefined, noop } from "lodash";
import { select } from "@wordpress/data";
import * as tinyMCEHelper from "../lib/tinymce";
import { tinyMCEDecorator } from "../decorator/tinyMCE";
import { isAnnotationAvailable, applyAsAnnotations } from "../decorator/gutenberg";
import { doAction } from "@wordpress/hooks";

/**
 * Create decorators for each editor and applies marks to each editor
 *
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 *
 * @returns {void}
 */
function applyMarksTinyMCE( paper, marks ) {
	// Get all registered TinyMCE editors on the page.
	const editors = tinyMCE.editors;
	// Create decorators for all editors.
	const decorators = editors.map( editor => tinyMCEDecorator( editor ) );
	// Use decorators to apply marks for to each editor.
	decorators.forEach( decorator => decorator( paper, marks ) );
}

/**
 * Applies the given marks to the content.
 *
 * @param {Paper} paper The paper.
 * @param {Array.<Mark>} marks The marks.
 *
 * @returns {void}
 */
function applyMarks( paper, marks ) {
	let decorator;

	// Classic editor
	if ( tinyMCEHelper.isTinyMCEAvailable( tinyMCEHelper.tmceId ) ) {
		if ( isUndefined( decorator ) ) {
			decorator = tinyMCEDecorator( tinyMCE.get( tinyMCEHelper.tmceId ) );
		}

		decorator( paper, marks );
	}

	// Block/Gutenberg editor
	if ( isAnnotationAvailable() ) {
		// Apply marks to Classic editor blocks
		applyMarksTinyMCE( paper, marks );
		// Apply marks to other blocks
		applyAsAnnotations( marks );
	}

	doAction( "yoast.analysis.applyMarks", marks );
}

/**
 * Gets the applyMarks or empty function depending on the marksButtonStatus.
 *
 * @returns {Function} The marker function or an empty function.
 */
export default function getApplyMarks() {
	const showMarkers = select( "yoast-seo/editor" ).isMarkingAvailable();
	const markersPaused = select( "yoast-seo/editor" ).getMarkerPauseStatus();

	if ( ! showMarkers || markersPaused ) {
		return noop;
	}

	return applyMarks;
}
