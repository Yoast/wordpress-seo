/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";

/**
 * Container that holds the media object.
 *
 * @returns {void}
 */
const MediaWrapper = () => {};

MediaWrapper.getMedia = () => {
	if ( ! MediaWrapper.media ) {
		MediaWrapper.media = window.wp.media();
	}

	return MediaWrapper.media;
};

// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
domReady( () => {
	const media = MediaWrapper.getMedia();
	media.on( "select", () => {
		const selected = media.state().get( "selection" ).first();
		wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
			url: selected.attribute.url,
			id: selected.attributes.id,
		} );
	} );
	wpDataDispatch( "yoast-seo/editor" ).loadFacebookPreviewData();
} );

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			getFacebookDescription,
			getFacebookTitle,
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
			title: getFacebookTitle(),
			imageWarnings: getFacebookWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! ownProps.isPremium,
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
				MediaWrapper.getMedia().open();
			},
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
		};
	} ),
] )( FacebookWrapper );
