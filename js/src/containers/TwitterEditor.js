/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";

const isPremium = window.wpseoAdminL10n.isPremium;

/**
 * Container that holds the media object.
 *
 * @returns {void}
 */
const TwitterContainer = () => {};

TwitterContainer.getMedia = () => {
	if ( ! TwitterContainer.media ) {
		TwitterContainer.media = window.wp.media();
	}

	return TwitterContainer.media;
};

domReady( () => {
	const media = TwitterContainer.getMedia();
	// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
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
		window.wp.data.dispatch( "yoast-seo/editor" ).setTwitterPreviewImage( {
			bytes: filesizeInBytes,
			type: subtype,
			url,
			id,
			width,
			height,
			alt,
		} );
	} );
} );

export default compose( [
	withSelect( select => {
		const {
			getTwitterDescription,
			getTwitterTitle,
			getTwitterImageUrl,
			getImageFallback,
			getTwitterWarnings,
			getTwitterAlt,
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
			alt: getTwitterAlt(),
			isPremium: !! isPremium,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setTwitterPreviewTitle,
			setTwitterPreviewDescription,
			clearTwitterPreviewImage,
			loadTwitterPreviewData,
		} = dispatch( "yoast-seo/editor" );

		return {
			onSelectImageClick: () => {
				TwitterContainer.media.open();
			},
			onRemoveImageClick:	clearTwitterPreviewImage,
			onDescriptionChange: setTwitterPreviewDescription,
			onTitleChange: setTwitterPreviewTitle,
			loadTwitterPreviewData,
		};
	} ),
] )( TwitterWrapper );
