import { useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { escapeRegExp, get } from "lodash";
import { CONTENT_TYPE, EDIT_TYPE, STORE_NAME_EDITOR } from "../constants";
import { applyPluggableReplacementVariables } from "../helpers";

/**
 * Transforms a replacement variable to a format suitable for the UI.
 * @param {{name: string, label: string, value: string, hidden: boolean}} replaceVariable The replacement variable to transform.
 * @returns {{name: string, label: string, value: string, hidden: boolean, badge: string}} The transformed replacement variable.
 */
const transformReplaceVariable = ( replaceVariable ) => {
	const newReplaceVariable = { ...replaceVariable };

	if ( replaceVariable.value === "" && ! [ "title", "excerpt", "excerpt_only" ].includes( replaceVariable.name ) ) {
		newReplaceVariable.value = "%%" + replaceVariable.name + "%%";
	}
	newReplaceVariable.badge = `<badge>${ replaceVariable.label }</badge>`;

	return newReplaceVariable;
};

/**
 * @returns {function} The function to apply replacement variables to content.
 */
export const useApplyReplacementVariables = () => {
	const rawReplacementVariables = useSelect( ( select ) => select( STORE_NAME_EDITOR ).getReplaceVars(), [] );
	const replacementVariables = useMemo( () => {
		return rawReplacementVariables.map( transformReplaceVariable );
	}, [ rawReplacementVariables ] );

	return useCallback(
		/**
		 * @param {string} content The content.
		 * @param {Object} [options] The options.
		 * @param {string} [options.key="value"] The replacement variable key, used for replacing.
		 * @param {Object} [options.overrides] Override a replacement variable "value" (or key). Keyed by replacement variable name.
		 * @param {boolean} [options.applyPluggable] Whether to also apply replacement variables using pluggable.
		 * @param {string} [options.editType] Whether a title or description. Needed when applying pluggable replacement variables.
		 * @param {string} [options.contentType] Whether a post or term. Used for removing the string "Archives" for terms.
		 * @returns {string} The content with replacements.
		 */
		( // eslint-disable-line complexity
			content,
			{
				key = "value",
				overrides = {},
				applyPluggable = true,
				editType = EDIT_TYPE.title,
				contentType = CONTENT_TYPE.post,
			} = {}
		) => {
			for ( const replacementVariable of replacementVariables ) {
				content = content.replace(
					new RegExp( "%%" + escapeRegExp( replacementVariable.name ) + "%%", "g" ),
					get( overrides, replacementVariable.name, replacementVariable[ key ] )
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
