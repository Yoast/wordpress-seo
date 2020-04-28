/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";
import wpMediaHelper from "../helpers/wpMediaHelper";

const isPremium = window.wpseoAdminL10n.isPremium;

domReady( () => {
	const media = wpMediaHelper.media;
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
		wpDataDispatch( "yoast-seo/editor" ).setTwitterPreviewImage( {
			bytes: filesizeInBytes,
			type: subtype,
			url,
			id,
			width,
			height,
			alt,
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
		} = dispatch( "yoast-seo/editor" );

		return {
			onSelectImageClick: () => {
				wpMediaHelper.media.open();
			},
			onRemoveImageClick:	clearTwitterPreviewImage,
			onDescriptionChange: setTwitterPreviewDescription,
			onTitleChange: setTwitterPreviewTitle,
		};
	} ),
] )( TwitterWrapper );
