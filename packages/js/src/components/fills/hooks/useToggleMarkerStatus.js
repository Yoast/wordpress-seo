import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Toggles the markers status, based on the editor mode and the AI Optimize button status.
 * @returns {void}
 */
const useToggleMarkerStatus = () => {
	const { editorMode, activeAIButtonId } = useSelect( ( select ) => ( {
		editorMode: select( "core/edit-post" ).getEditorMode(),
		activeAIButtonId: select( "yoast-seo/editor" ).getActiveAIFixesButton(),
	} ), [] );
	const { setMarkerStatus } = useDispatch( "yoast-seo/editor" );

	useEffect( () => {
		// Toggle markers based on editor mode.
		if ( ( editorMode === "visual" && activeAIButtonId ) || editorMode === "text" ) {
			setMarkerStatus( "disabled" );
		} else {
			setMarkerStatus( "enabled" );
		}

		// Cleanup function to reset the marker status when the component unmounts or editor mode changes
		return () => {
			setMarkerStatus( "disabled" );
		};
	}, [ editorMode, activeAIButtonId ] );
};

export default useToggleMarkerStatus;
