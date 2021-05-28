/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { validateFacebookImage } from "@yoast/helpers";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";
import getL10nObject from "../analysis/getL10nObject";
import withLocation from "../helpers/withLocation";
import { openMedia } from "../helpers/selectMedia";

const socialMediumName = "Facebook";

/**
 * Callback function for selectMedia. Performs actions with the 'image' Object that it gets as an argument.
 *
 * @param {Object} image Object containing data about the selected image.
 *
 * @param {Function} onSelect Callback function received from openMedia. Gets object image' as an argument.
 *
 * @returns {void}
 */
const imageCallback = ( image ) => {
	wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
		url: image.url,
		id: image.id,
		warnings: validateFacebookImage( image ),
	} );
};

/**
 * Lazy function to open the media instance.
 *
 * @returns {void}
 */
const selectMedia = () => {
	openMedia( imageCallback );
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
			replacementVariables: getReplaceVars(),
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
			onSelectImageClick: selectMedia,
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
			onLoad: loadFacebookPreviewData,
		};
	} ),

	withLocation(),
] )( FacebookWrapper );
