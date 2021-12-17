/* global tinymce */
import { DOM_IDS } from "../dom";
import { useCallback, useEffect, useState } from "@wordpress/element";

/**
 * Retrieve the tinymce editor instance.
 *
 * @returns {object} The TinyMCE editor.
 */
const useEditor = () => {
	const [ editor, setEditor ] = useState( null );

	const contentEditorListener = useCallback( ( e ) => {
		if ( e.editor.id === DOM_IDS.CONTENT ) {
			setEditor( e.editor );
		}
	}, [ setEditor ] );

	useEffect( () => {
		if ( ! tinymce ) {
			return;
		}

		// Is the editor already present? Use that.
		const contentEditor = tinymce.get( DOM_IDS.CONTENT );
		if ( contentEditor ) {
			setEditor( contentEditor );
			return;
		}

		// Listen for the editor.
		tinymce.on( "AddEditor", contentEditorListener );
	}, [ tinymce ] );

	// Remove our listener (whether it was actually enabled or not).
	useEffect( () => {
		if ( editor ) {
			tinymce.off( "AddEditor", contentEditorListener );
		}
	}, [ editor ] );

	return editor;
};

export default useEditor;
