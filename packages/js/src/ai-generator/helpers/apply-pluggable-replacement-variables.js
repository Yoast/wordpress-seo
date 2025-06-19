import { get } from "lodash";
import { languageProcessing } from "yoastseo";
import { applyReplaceUsingPlugin } from "../../helpers/replacementVariableHelpers";
import { EDIT_TYPE } from "../constants";

/**
 * @param {string} content The content.
 * @param {string} [editType] The edit type. See EDIT_TYPE.
 * @returns {string} The content with replaced variables.
 */
export const applyPluggableReplacementVariables = ( content, editType = EDIT_TYPE.title ) => {
	const replaced = applyReplaceUsingPlugin( {
		// Ensure the types are all present. This prevents an error as "replace" is always executed on them.
		title: "",
		description: "",
		// Override with the wanted type's content.
		[ editType ]: languageProcessing.stripSpaces( content ),
	} );
	return get( replaced, editType, content );
};
