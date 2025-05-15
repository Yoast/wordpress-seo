import { select } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { constant } from "lodash";
import { PREVIEW_TYPE, STORE_NAME_EDITOR } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {function} The function to get the title template.
 */
export const useGetTitleTemplate = () => {
	const { previewType } = useTypeContext();

	return useMemo( () => {
		switch ( previewType ) {
			case PREVIEW_TYPE.google:
				return () => select( STORE_NAME_EDITOR ).getSnippetEditorData().title;
			case PREVIEW_TYPE.social:
				return select( STORE_NAME_EDITOR ).getFacebookTitleOrFallback;
			case PREVIEW_TYPE.twitter:
				return select( STORE_NAME_EDITOR ).getTwitterTitleOrFallback;
			default:
				return constant( "" );
		}
	}, [ previewType ] );
};
