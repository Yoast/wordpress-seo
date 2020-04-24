/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";

const isPremium = window.wpseoAdminL10n.isPremium;

/**
 * Container that holds the media object.
 *
 * @returns {void}
 */
const FacebookContainer = () => {};

FacebookContainer.getMedia = () => {
	if ( ! FacebookContainer.media ) {
		FacebookContainer.media = window.wp.media();
	}

	return FacebookContainer.media;
};

// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
domReady( () => {
	const media = FacebookContainer.getMedia();
	media.on( "select", () => {
		const selected = media.state().get( "selection" ).first();
		const {
			filesizeInBytes,
			subtype,
			height,
			width,
			url,
			id,
			alt,
		} = selected.attributes;
		wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
			bytes: filesizeInBytes,
			type: subtype,
			url,
			id,
			width,
			height,
			alt,
		} );
	} );
	wpDataDispatch( "yoast-seo/editor" ).loadFacebookPreviewData();
} );

export default compose( [
	withSelect( select => {
		const {
			getFacebookDescription,
			getFacebookTitle,
			getFacebookImageUrl,
			getImageFallback,
			getFacebookWarnings,
			getFacebookAlt,
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
			title: getFacebookTitle(),
			imageWarnings: getFacebookWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			alt: getFacebookAlt(),
			isPremium: !! isPremium,
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
				FacebookContainer.getMedia().open();
			},
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
		};
	} ),
] )( FacebookWrapper );
