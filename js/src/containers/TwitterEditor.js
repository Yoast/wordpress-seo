/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";

const isPremium = window.wpseoAdminL10n.isPremium;

const socialMediumName = "Twitter";

const titlePlaceholder = window.wpseoScriptData.metabox.title_template;

/* Translators: %s expands to the social medium name, i.e. Faceboook. */
const descriptionPlaceholder  = sprintf(
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	__( "Modify your %s description by editing it right here...", "yoast-components" ),
	socialMediumName
);

/**
 * Container that holds the media object.
 *
 * @returns {void}
 */
const MediaWrapper = () => {};

MediaWrapper.get = () => {
	if ( ! MediaWrapper.media ) {
		MediaWrapper.media = window.wp.media();
	}

	return MediaWrapper.media;
};

if ( window.wpseoScriptData.metabox.showSocial.twitter ) {
	domReady( () => {
		const media = MediaWrapper.get();
		// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
		media.on( "select", () => {
			const selected = media.state().get( "selection" ).first();
			wpDataDispatch( "yoast-seo/editor" ).setTwitterPreviewImage( {
				url: selected.attributes.url,
				id: selected.attributes.id,
			} );
		} );
		wpDataDispatch( "yoast-seo/editor" ).loadTwitterPreviewData();
	} );
}

export default compose( [
	withSelect( select => {
		const {
			getTwitterDescription,
			getTwitterTitle,
			getTwitterImageUrl,
			getFacebookImageUrl,
			getTwitterWarnings,
			getTwitterImageType,
			getImageFallback,
			getRecommendedReplaceVars,
			getReplaceVars,
			getSiteUrl,
			getAuthorName,
		} = select( "yoast-seo/editor" );
		return {
			imageUrl: getTwitterImageUrl(),
			imageFallbackUrl: getFacebookImageUrl() || getImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getTwitterDescription(),
			title: getTwitterTitle(),
			imageWarnings: getTwitterWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! isPremium,
			isLarge: getTwitterImageType(),
			titlePlaceholder,
			descriptionPlaceholder,
			socialMediumName,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setTwitterPreviewTitle,
			setTwitterPreviewDescription,
			clearTwitterPreviewImage,
		} = dispatch( "yoast-seo/editor" );

		return {
			onSelectImageClick: () => {
				MediaWrapper.get().open();
			},
			onRemoveImageClick:	clearTwitterPreviewImage,
			onDescriptionChange: setTwitterPreviewDescription,
			onTitleChange: setTwitterPreviewTitle,
		};
	} ),
] )( TwitterWrapper );
