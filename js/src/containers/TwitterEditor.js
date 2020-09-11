/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { validateTwitterImage } from "@yoast/helpers";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";
import getL10nObject from "../analysis/getL10nObject";

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
			wpDataDispatch( "yoast-seo/editor" ).setTwitterPreviewImage( {
				url: selected.attributes.url,
				id: selected.attributes.id,
				warnings: validateTwitterImage( image ),
			} );
		} );
	}

	return media;
};

/**
 * Lazy function to open the media instance.
 *
 * @returns {void}
 */
const openMedia = () => {
	return getMedia().open();
};

/* eslint-disable complexity */
export default compose( [
	withSelect( ( select, ownProps ) => {
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
			isPremium: !! getL10nObject().isPremium,
			isLarge: getTwitterImageType() !== "summary",
			titleInputPlaceholder,
			descriptionInputPlaceholder,
			socialMediumName,
			location: ownProps.location || "",
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
			onSelectImageClick: openMedia,
			onRemoveImageClick:	clearTwitterPreviewImage,
			onDescriptionChange: setTwitterPreviewDescription,
			onTitleChange: setTwitterPreviewTitle,
			onLoad: loadTwitterPreviewData,
		};
	} ),
] )( TwitterWrapper );
/* eslint-enable complexity */
