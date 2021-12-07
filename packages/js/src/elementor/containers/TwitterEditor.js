/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";
import { validateTwitterImage } from "@yoast/helpers";

/* Internal dependencies */
import TwitterWrapper from "../../components/social/TwitterWrapper";
import getL10nObject from "../../analysis/getL10nObject";
import withLocation from "../../helpers/withLocation";
import { getCurrentReplacementVariablesForEditor } from "../replaceVars/elementor-replacevar-plugin";

const socialMediumName = "Twitter";

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
	withSelect( select => {
		const {
			getTwitterDescription,
			getTwitterTitle,
			getTwitterImageUrl,
			getFacebookImageUrl,
			getFacebookTitle,
			getFacebookDescription,
			getDescription,
			getSeoTitle,
			getTwitterWarnings,
			getTwitterImageType,
			getEditorDataImageFallback,
			getRecommendedReplaceVars,
			getSiteUrl,
			getSeoTitleTemplate,
			getSeoTitleTemplateNoFallback,
			getSocialTitleTemplate,
			getSeoDescriptionTemplate,
			getSocialDescriptionTemplate,
			getEditorDataExcerptWithFallback,
		} = select( "yoast-seo/editor" );

		const titleInputPlaceholder  = "";

		const descriptionInputPlaceholder  = "";

		return {
			imageUrl: getTwitterImageUrl(),
			imageFallbackUrl: getFacebookImageUrl() || getEditorDataImageFallback(),
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getCurrentReplacementVariablesForEditor(),
			description: getTwitterDescription(),
			descriptionPreviewFallback: getSocialDescriptionTemplate() ||
				getFacebookDescription() ||
				getDescription() ||
				getSeoDescriptionTemplate() ||
				getEditorDataExcerptWithFallback() ||
				descriptionInputPlaceholder,
			title: getTwitterTitle(),
			titlePreviewFallback: getSocialTitleTemplate() ||
				getFacebookTitle() ||
				getSeoTitle() ||
				getSeoTitleTemplateNoFallback() ||
				getSeoTitleTemplate() ||
				titleInputPlaceholder,
			imageWarnings: getTwitterWarnings(),
			siteUrl: getSiteUrl(),
			isPremium: !! getL10nObject().isPremium,
			isLarge: getTwitterImageType() !== "summary",
			titleInputPlaceholder,
			descriptionInputPlaceholder,
			socialMediumName,
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

	withLocation(),
] )( TwitterWrapper );
/* eslint-enable complexity */
