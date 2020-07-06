/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import domReady from "@wordpress/dom-ready";
import { validateTwitterImage } from "@yoast/helpers";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";

const isPremium = window.wpseoAdminL10n.isPremium;

const socialMediumName = "Twitter";

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
			const image = {
				type: selected.attributes.subtype,
				width: selected.attributes.width,
				height: selected.attributes.height,
			};
			wpDataDispatch( "yoast-seo/editor" ).setTwitterPreviewImage( {
				url: selected.attributes.url,
				id: selected.attributes.id,
				warnings: validateTwitterImage( image ),
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
			getFacebookTitle,
			getFacebookDescription,
			getDescriptionFallback,
			getTitleFallback,
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
			descriptionPreviewFallback: getFacebookDescription() || getDescriptionFallback() || descriptionInputPlaceholder,
			title: getTwitterTitle(),
			titlePreviewFallback: getFacebookTitle() || getTitleFallback() || titleInputPlaceholder,
			imageWarnings: getTwitterWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! isPremium,
			isLarge: getTwitterImageType() !== "summary",
			titleInputPlaceholder,
			descriptionInputPlaceholder,
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
