import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { MARKER_STATUS, SEO_STORE_NAME } from "@yoast/seo-integration";
import { forEach } from "lodash";
import { markers } from "yoastseo";
import useEditor from "../hooks/use-editor";

/**
 * Handles the active marker, updating the markings in the editor.
 *
 * @returns {void}
 */
export const useMarker = () => {
	const activeMarkerId = useSelect( select => select( SEO_STORE_NAME ).selectActiveMarkerId() );
	const marks = useSelect( select => select( SEO_STORE_NAME ).selectActiveMarks() );

	const editor = useEditor();

	// Handle the editor its content markings.
	useEffect( () => {
		const hasEditor = editor && editor.dom;
		const hasMarkings = activeMarkerId !== "" && marks.length > 0;

		if ( ! hasEditor ) {
			return;
		}

		let content = editor.getContent();
		content = markers.removeMarks( content );

		if ( ! hasMarkings ) {
			editor.setContent( content );
		}

		forEach( marks, mark => {
			content = content.split( mark.original ).join( mark.marked );
		} );

		content = content
			.replace( new RegExp( "&lt;yoastmark.+?&gt;", "g" ), "" )
			.replace( new RegExp( "&lt;/yoastmark&gt;", "g" ), "" );

		editor.setContent( content );

		/*
		 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
		 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
		 */
		const markElements = editor.dom.select( "yoastmark" );
		forEach( markElements, markElement => {
			markElement.setAttribute( "data-mce-bogus", "1" );
		} );
	}, [ editor, activeMarkerId, marks ] );
};

/**
 * Handles the marker status, depending on the editor mode.
 *
 * @returns {void}
 */
export const useMarkerStatus = () => {
	const { updateActiveMarker, updateMarkerStatus } = useDispatch( SEO_STORE_NAME );

	const editor = useEditor();

	// Update the marker status relative to the editor its visibility.
	useEffect( () => {
		if ( editor === null ) {
			return;
		}

		updateMarkerStatus( editor.isHidden() ? MARKER_STATUS.DISABLED : MARKER_STATUS.ENABLED );
		editor.on( "hide", () => {
			updateActiveMarker( { id: "", marks: [] } );
			updateMarkerStatus( MARKER_STATUS.DISABLED );
		} );
		editor.on( "show", () => {
			updateMarkerStatus( MARKER_STATUS.ENABLED );
		} );
	}, [ editor ] );
};
