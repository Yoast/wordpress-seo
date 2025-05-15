import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { EDIT_TYPE, STORE_NAME_AI, TITLE_VARIABLE_REPLACE } from "../constants";
import { enforceTitleVariable } from "../helpers";
import { useGetTitleTemplate } from "./use-get-title-template";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {string} The title template.
 */
export const useTitleTemplate = () => {
	const { editType, previewType, contentType } = useTypeContext();
	const getTitleTemplate = useGetTitleTemplate();
	const appliedSuggestion = useSelect(
		select => select( STORE_NAME_AI ).selectAppliedSuggestionFor( { editType, previewType } ),
		[ editType, previewType ],
	);

	return useMemo( () => {
		let template = getTitleTemplate();
		if ( editType === EDIT_TYPE.description ) {
			return template;
		}

		if ( appliedSuggestion ) {
			// Use the previously applied suggestion as the title template.
			template = template.replace( appliedSuggestion, TITLE_VARIABLE_REPLACE[ contentType ] );
		}
		return enforceTitleVariable( template, contentType );
	}, [ editType, getTitleTemplate ] );
};
