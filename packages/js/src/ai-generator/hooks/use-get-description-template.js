import { select } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { constant } from "lodash";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { PREVIEW_TYPE } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {function} The function to get the description template.
 */
export const useGetDescriptionTemplate = () => {
	const { previewType } = useTypeContext();

	return useMemo( () => {
		switch ( previewType ) {
			case PREVIEW_TYPE.google:
				return () => select( STORE_NAME_EDITOR.free ).getSnippetEditorData().description;
			case PREVIEW_TYPE.social:
				return select( STORE_NAME_EDITOR.free ).getFacebookDescriptionOrFallback;
			case PREVIEW_TYPE.twitter:
				return select( STORE_NAME_EDITOR.free ).getTwitterDescriptionOrFallback;
			default:
				return constant( "" );
		}
	}, [ previewType ] );
};
