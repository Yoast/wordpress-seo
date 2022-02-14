/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
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
				alt: selected.attributes.alt,
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
	withSelect( select => {
		const {
			getFacebookDescription,
			getDescription,
			getFacebookTitle,
			getSeoTitle,
			getFacebookImageUrl,
			getEditorDataImageFallback,
			getFacebookWarnings,
			getRecommendedReplaceVars,
			getSiteUrl,
			getSeoTitleTemplate,
			getSeoTitleTemplateNoFallback,
			getSocialTitleTemplate,
			getSeoDescriptionTemplate,
			getSocialDescriptionTemplate,
			getEditorDataExcerptWithFallback,
			getFacebookAltText,
		} = select( "yoast-seo/editor" );

		const titleInputPlaceholder  = "";

		const descriptionInputPlaceholder  = "";

		return {
			imageUrl: getFacebookImageUrl(),
			imageFallbackUrl: getEditorDataImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getCurrentReplacementVariablesForEditor(),
			description: getFacebookDescription(),
			descriptionPreviewFallback: getSocialDescriptionTemplate() ||
				getDescription() ||
				getSeoDescriptionTemplate() ||
				getEditorDataExcerptWithFallback() ||
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
			onSelectImageClick: openMedia,
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
			onLoad: loadFacebookPreviewData,
		};
	} ),

	withLocation(),
] )( FacebookWrapper );
/* eslint-enable complexity */
