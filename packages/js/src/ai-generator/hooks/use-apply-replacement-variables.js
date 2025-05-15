import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { escapeRegExp, get } from "lodash";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { CONTENT_TYPE, EDIT_TYPE } from "../constants";
import { applyPluggableReplacementVariables } from "../helpers";

/**
 * @returns {function} The function to apply replacement variables to content.
 */
export const useApplyReplacementVariables = () => {
	const replacementVariables = useSelect( select => {
		const replaceVars = select( STORE_NAME_EDITOR.free ).getReplaceVars();
		// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
		replaceVars.forEach( ( replaceVariable ) => {
			if ( replaceVariable.value === "" && ! [ "title", "excerpt", "excerpt_only" ].includes( replaceVariable.name ) ) {
				replaceVariable.value = "%%" + replaceVariable.name + "%%";
			}
			replaceVariable.badge = `<badge>${ replaceVariable.label }</badge>`;
		} );
		return replaceVars;
	}, [] );

	return useCallback(
		/**
		 * @param {string} content The content.
		 * @param {string} [key="value"] The replacement variable key, used for replacing.
		 * @param {Object} [overrides] Override a replacement variable "value" (or key). Keyed by replacement variable name.
		 * @param {boolean} [applyPluggable] Whether to also apply replacement variables using pluggable.
		 * @param {string} [editType] Whether a title or description. Needed when applying pluggable replacement variables.
		 * @param {string} [contentType] Whether a post or term. Used for removing the string "Archives" for terms.
		 * @returns {string} The content with replacements.
		 */
		( content, { key = "value", overrides = {}, applyPluggable = true, editType = EDIT_TYPE.title, contentType = CONTENT_TYPE.post } = {} ) => {
			for ( const replacementVariable of replacementVariables ) {
				content = content.replace(
					new RegExp( "%%" + escapeRegExp( replacementVariable.name ) + "%%", "g" ),
					get( overrides, replacementVariable.name, replacementVariable[ key ] ),
				);
			}
			// For terms, remove the "Archives" part from the content if present.
			if ( contentType === CONTENT_TYPE.term ) {
				content = content.replace( " Archives", "" );
			}
			return applyPluggable ? applyPluggableReplacementVariables( content, editType ) : content;
		},
		[ replacementVariables ] );
};
