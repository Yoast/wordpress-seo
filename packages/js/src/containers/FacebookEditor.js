/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";
import getL10nObject from "../analysis/getL10nObject";
import withLocation from "../helpers/withLocation";
import { openMedia, prepareFacebookPreviewImage } from "../helpers/selectMedia";
import getMemoizedFindCustomFields from "../helpers/getMemoizedFindCustomFields";

const socialMediumName = "Social";

/**
 * Lazy function to open the media instance.
 *
 * @returns {void}
 */
const selectMedia = () => {
	openMedia( ( image ) => wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( prepareFacebookPreviewImage( image ) ) );
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

	withDispatch( ( dispatch, ownProps, { select } ) => {
		const {
			setFacebookPreviewTitle,
			setFacebookPreviewDescription,
			clearFacebookPreviewImage,
			loadFacebookPreviewData,
			findCustomFields,
		} = dispatch( "yoast-seo/editor" );

		const postId = select( "yoast-seo/editor" ).getPostId();

		return {
			onSelectImageClick: selectMedia,
			onRemoveImageClick: clearFacebookPreviewImage,
			onDescriptionChange: setFacebookPreviewDescription,
			onTitleChange: setFacebookPreviewTitle,
			onLoad: loadFacebookPreviewData,
			onReplacementVariableSearchChange: getMemoizedFindCustomFields( postId, findCustomFields ),
		};
	} ),

	withLocation(),
] )( FacebookWrapper );
/* eslint-enable complexity */
