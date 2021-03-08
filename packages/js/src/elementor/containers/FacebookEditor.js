/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { validateFacebookImage } from "@yoast/helpers";

/* Internal dependencies */
import FacebookWrapper from "../../components/social/FacebookWrapper";
import getL10nObject from "../../analysis/getL10nObject";
import withLocation from "../../helpers/withLocation";
import { getCurrentReplacementVariablesForEditor } from "../replaceVars/elementor-replacevar-plugin";

const socialMediumName = "Facebook";

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
			getSiteUrl,
			getAuthorName,
		} = select( "yoast-seo/editor" );

		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const titleInputPlaceholder  = sprintf(
			/* Translators: %s expands to the social medium name, i.e. Faceboook. */
			__( "Modify your %s title by editing it right here...", "wordpress-seo" ),
			socialMediumName
		);

		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const descriptionInputPlaceholder  = sprintf(
			/* Translators: %s expands to the social medium name, i.e. Faceboook. */
			__( "Modify your %s description by editing it right here...", "wordpress-seo" ),
			socialMediumName
		);

		return {
			imageUrl: getFacebookImageUrl(),
			imageFallbackUrl: getImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getCurrentReplacementVariablesForEditor(),
			description: getFacebookDescription(),
			descriptionPreviewFallback: getDescriptionFallback() || descriptionInputPlaceholder,
			title: getFacebookTitle(),
			titlePreviewFallback: getTitleFallback() || titleInputPlaceholder,
			imageWarnings: getFacebookWarnings(),
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
			isPremium: !! getL10nObject().isPremium,
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
			loadFacebookPreviewData,
		} = dispatch( "yoast-seo/editor" );
		return {
			onSelectImageClick: openMedia,
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
			onLoad: loadFacebookPreviewData,
		};
	} ),

	withLocation(),
] )( FacebookWrapper );
