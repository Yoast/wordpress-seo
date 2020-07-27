/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { validateFacebookImage, validateTwitterImage } from "@yoast/helpers";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";

const socialMediumName = "Facebook";

/* Translators: %s expands to the social medium name, i.e. Faceboook. */
const titleInputPlaceholder  = sprintf(
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	__( "Modify your %s title by editing it right here...", "yoast-components" ),
	socialMediumName
);

/* Translators: %s expands to the social medium name, i.e. Faceboook. */
const descriptionInputPlaceholder  = sprintf(
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	__( "Modify your %s description by editing it right here...", "yoast-components" ),
	socialMediumName
);

/**
 * The cached instance of the media object.
 *
 * @type {wp.media} The media object
 */
let media = null;

/**
 * Lazy function to get the media object and hook the right action dispatchers.
 *
 * @returns {void}
 */
const getMedia = () => {
	if ( ! media ) {
		media = window.wp.media();
		// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
		media.on( "select", () => {
			const selected = media.state().get( "selection" ).first();
			const image = {
				type: selected.attributes.subtype,
				width: selected.attributes.width,
				height: selected.attributes.height,
			};
			wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
				url: selected.attributes.url,
				id: selected.attributes.id,
				warnings: validateFacebookImage( image ),
			} );
		} );
		wpDataDispatch( "yoast-seo/editor" ).loadFacebookPreviewData();
	}

	return media;
};

export default compose( [
	withSelect( select => {
		const {
			getFacebookDescription,
			getDescriptionFallback,
			getFacebookTitle,
			getTitleFallback,
			getFacebookImageUrl,
			getImageFallback,
			getFacebookWarnings,
			getRecommendedReplaceVars,
			getReplaceVars,
			getSiteUrl,
			getAuthorName,
		} = select( "yoast-seo/editor" );

		return {
			imageUrl: getFacebookImageUrl(),
			imageFallbackUrl: getImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getFacebookDescription(),
			descriptionPreviewFallback: getDescriptionFallback() || descriptionInputPlaceholder,
			title: getFacebookTitle(),
			titlePreviewFallback: getTitleFallback() || titleInputPlaceholder,
			imageWarnings: getFacebookWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! window.wpseoAdminL10n.isPremium,
			titleInputPlaceholder,
			descriptionInputPlaceholder,
			socialMediumName,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setFacebookPreviewTitle,
			setFacebookPreviewDescription,
			clearFacebookPreviewImage,
		} = dispatch( "yoast-seo/editor" );
		return {
			onSelectImageClick: () => {
				getMedia().open();
			},
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
		};
	} ),
] )( FacebookWrapper );
