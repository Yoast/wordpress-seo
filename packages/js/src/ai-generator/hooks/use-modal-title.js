import { __ } from "@wordpress/i18n";
import { EDIT_TYPE, PREVIEW_TYPE } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {string} The modal title
 */
export const useModalTitle = () => {
	const { editType, previewType } = useTypeContext();

	switch ( previewType ) {
		case PREVIEW_TYPE.social:
			return editType === EDIT_TYPE.description
				? __( "AI social description generator", "wordpress-seo-premium" )
				: __( "AI social title generator", "wordpress-seo-premium" );
		case PREVIEW_TYPE.twitter:
			return editType === EDIT_TYPE.description
				? __( "AI X description generator", "wordpress-seo-premium" )
				: __( "AI X title generator", "wordpress-seo-premium" );
		default:
			return editType === EDIT_TYPE.description
				? __( "AI description generator", "wordpress-seo-premium" )
				: __( "AI title generator", "wordpress-seo-premium" );
	}
};
