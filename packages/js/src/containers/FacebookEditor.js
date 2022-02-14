/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { validateFacebookImage } from "@yoast/helpers";
import { FACEBOOK_IMAGE_SIZES, determineFacebookImageMode } from "@yoast/social-metadata-previews";

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
	const { width, height } = image;
	const imageMode = determineFacebookImageMode( { width, height } );

	const idealWidth = FACEBOOK_IMAGE_SIZES[ imageMode + "Width" ];
	const idealHeight = FACEBOOK_IMAGE_SIZES[ imageMode + "Height" ];

	const idealImageSize = Object.values( image.sizes ).find( size => {
		return size.width >= idealWidth && size.height >= idealHeight;
	} );

	const imageUrl = idealImageSize ? idealImageSize.url : image.url;

	wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
		url: imageUrl,
		id: image.id,
		warnings: validateFacebookImage( image ),
		alt: image.alt ?? "",
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

/* eslint-disable complexity */
export default compose( [
	withSelect( select => {
		const {
			getFacebookDescription,
			getDescription,
			getFacebookTitle,
			getSeoTitle,
			getFacebookImageUrl,
			getImageFallback,
			getFacebookWarnings,
			getRecommendedReplaceVars,
			getReplaceVars,
			getSiteUrl,
			getSeoTitleTemplate,
			getSeoTitleTemplateNoFallback,
			getSocialTitleTemplate,
			getSeoDescriptionTemplate,
			getSocialDescriptionTemplate,
			getReplacedExcerpt,
			getFacebookAltText,
		} = select( "yoast-seo/editor" );

		const titleInputPlaceholder  = "";

		const descriptionInputPlaceholder  = "";

		return {
			imageUrl: getFacebookImageUrl(),
			imageFallbackUrl: getImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getFacebookDescription(),
			descriptionPreviewFallback: getSocialDescriptionTemplate() ||
				getDescription() ||
				getSeoDescriptionTemplate() ||
				getReplacedExcerpt() ||
				descriptionInputPlaceholder,
			title: getFacebookTitle(),
			titlePreviewFallback: getSocialTitleTemplate() ||
				getSeoTitle() ||
				getSeoTitleTemplateNoFallback() ||
				getSeoTitleTemplate() ||
				titleInputPlaceholder,
			imageWarnings: getFacebookWarnings(),
			siteUrl: getSiteUrl(),
			isPremium: !! getL10nObject().isPremium,
			titleInputPlaceholder,
			descriptionInputPlaceholder,
			socialMediumName,
			alt: getFacebookAltText(),
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
/* eslint-enable complexity */
