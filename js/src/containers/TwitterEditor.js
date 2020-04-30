/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { get } from "lodash-es";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";

const isPremium = get( window, [ "wpseoAdminL10n.isPremium" ], false );

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

export default compose( [
	withSelect( select => {
		const {
			getTwitterDescription,
			getTwitterTitle,
			getTwitterImageUrl,
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
			imageFallbackUrl: getImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getTwitterDescription(),
			title: getTwitterTitle(),
			imageWarnings: getTwitterWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! isPremium,
			isLarge: getTwitterImageType(),
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
