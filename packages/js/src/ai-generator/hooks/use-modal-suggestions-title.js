import { __, sprintf } from "@wordpress/i18n";
import { EDIT_TYPE, PREVIEW_TYPE } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {string} The modal title
 */
export const useModalSuggestionsTitle = () => {
	const { editType, previewType } = useTypeContext();
	let previewLabel = "SEO";
	switch ( previewType ) {
		case PREVIEW_TYPE.social:
			previewLabel = "social";
			break;
		case PREVIEW_TYPE.twitter:
			previewLabel = "X";
			break;
	}
	switch ( editType ) {
		case EDIT_TYPE.title:
			return sprintf(
				/* translators: %s is the type of title. */
				__( "Generated %s titles", "wordpress-seo-premium" ),
				previewLabel
			);
		case EDIT_TYPE.description:
			if ( previewType === PREVIEW_TYPE.google ) {
				previewLabel = "meta";
			}
			return sprintf(
				/* translators: %s is the type of description. */
				__( "Generated %s descriptions", "wordpress-seo-premium" ),
				previewLabel
			);
	}
};
