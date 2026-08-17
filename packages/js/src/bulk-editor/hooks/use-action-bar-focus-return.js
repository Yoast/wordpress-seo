import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { STORE_NAME } from "../constants";

/**
 * Returns a function that moves focus back to the action bar's Select menu button.
 *
 * @returns {Function} The focus-return function.
 */
export const useActionBarFocusReturn = () => {
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	return useCallback( ( e ) => {
		const selectMenuButton = document.getElementById( `yst-bulk-editor-select-menu${ activeFieldSet }-button` );
		if ( selectMenuButton ) {
			selectMenuButton.focus();
		} else {
			e.currentTarget.blur();
		}
	}, [ activeFieldSet ] );
};
