/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";

/* Internal dependencies */
import TwitterWrapper from "../../components/social/TwitterWrapper";
import getL10nObject from "../../analysis/getL10nObject";
import withLocation from "../../helpers/withLocation";
import { getCurrentReplacementVariablesForEditor } from "../replaceVars/elementor-replacevar-plugin";
import { openMedia, prepareTwitterPreviewImage } from "../../helpers/selectMedia";

const socialMediumName = "Twitter";

/**
 * Lazy function to open the media instance.
 *
 * @returns {void}
 */
const selectMedia = () => {
	openMedia( ( image ) => wpDataDispatch( "yoast-seo/editor" ).setTwitterPreviewImage( prepareTwitterPreviewImage( image ) ) );
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
			getTwitterAltText,
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
			alt: getTwitterAltText(),
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
			onSelectImageClick: selectMedia,
			onRemoveImageClick:	clearTwitterPreviewImage,
			onDescriptionChange: setTwitterPreviewDescription,
			onTitleChange: setTwitterPreviewTitle,
			onLoad: loadTwitterPreviewData,
		};
	} ),

	withLocation(),
] )( TwitterWrapper );
/* eslint-enable complexity */
