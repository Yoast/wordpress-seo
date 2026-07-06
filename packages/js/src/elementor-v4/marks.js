/* global elementor, YoastSEO */
import { dispatch } from "@wordpress/data";
import { Paper } from "yoastseo";
import { buildContentAndMap } from "./content-walker";
import { getDocumentTree } from "./document-tree";

/**
 * Clears the active marker and removes any existing highlight marks.
 *
 * Dispatching an empty Paper through `applyMarks` lets the registered Elementor mark
 * applicator strip the `<yoastmark>` spans it previously wrote into the preview DOM.
 *
 * @returns {void}
 */
function resetMarks() {
	dispatch( "yoast-seo/editor" ).setActiveMarker( null );
	dispatch( "yoast-seo/editor" ).setMarkerPauseStatus( false );

	YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
}

/**
 * Returns per-widget position metadata for the current Elementor document.
 *
 * Each entry maps a widget node ID to its range in the normalized analysis
 * content string, so premium's mark applicator can apply marks at the correct
 * local offset without re-implementing the tree walk.
 *
 * @param {Object} [currentDocument] The Elementor document (defaults to current).
 * @returns {import("./content-walker").WidgetEntry[]} Array of widget entries.
 */
export function getWidgetMap( currentDocument = elementor.documents.getCurrent() ) {
	const tree = getDocumentTree( currentDocument );
	return buildContentAndMap( tree, currentDocument.$element ).widgets;
}

export { resetMarks };
