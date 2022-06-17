/* eslint-disable complexity */
import { useDispatch, useSelect } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useReplacementVariables } from "../../hooks/useReplacementVariables";

/**
 * Handles known data for a Twitter editor component.
 *
 * @param {JSX.Element} as          A Twitter editor component.
 * @param {Object}      restProps   Props to pass to the Twitter editor component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped Twitter editor component.
 */
const TwitterEditorContainer = ( { as: Component, ...restProps } ) => {
	const imageIsLarge = useSelect( select => select( "yoast-seo/editor" ).getTwitterImageType() ) !== "summary";
	const twitterTitle = useSelect( select => select( SEO_STORE_NAME ).selectTwitterTitle() );
	const twitterDescription = useSelect( select => select( SEO_STORE_NAME ).selectTwitterDescription() );
	const twitterImageUrl = useSelect( select => select( SEO_STORE_NAME ).selectTwitterImageURL() );
	const twitterImageAlt = useSelect( select => select( SEO_STORE_NAME ).selectTwitterImage() ).alt;
	const facebookTitle = useSelect( select => select( SEO_STORE_NAME ).selectFacebookTitle() );
	const facebookDescription = useSelect( select => select( SEO_STORE_NAME ).selectFacebookDescription() );
	const socialDescriptionTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialDescriptionTemplate() );
	const contentDescription = useSelect( select => select( SEO_STORE_NAME ).selectMetaDescription() );
	const contentExcerpt = useSelect( select => select( SEO_STORE_NAME ).selectExcerpt() );
	const socialTitleTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialTitleTemplate() );
	const seoTitle = useSelect( select=> select( SEO_STORE_NAME ).selectSeoTitle() );
	const seoTitleTemplate = useSelect( select => select( SEO_STORE_NAME ).selectTitleTemplate() );
	const seoDescriptionTemplate = useSelect( select => select( SEO_STORE_NAME ).selectDescriptionTemplate() );

	const { updateTwitterTitle, updateTwitterDescription } = useDispatch( SEO_STORE_NAME );
	const socialMediumName = "Twitter";

	const { replacementVariables, recommendedReplacementVariables } = useReplacementVariables();

	return <Component
		title={ twitterTitle }
		description={ twitterDescription }
		imageUrl={ twitterImageUrl }
		alt={ twitterImageAlt }
		isLarge={ imageIsLarge }
		onTitleChange={ updateTwitterTitle }
		onDescriptionChange={ updateTwitterDescription }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		titleInputPlaceholder={ "" }
		descriptionInputPlaceholder={ "" }
		descriptionPreviewFallback={ socialDescriptionTemplate || facebookDescription || contentDescription || seoTitleTemplate || contentExcerpt || "" }
		titlePreviewFallback={ socialTitleTemplate || facebookTitle || seoTitle || seoDescriptionTemplate || "" }
		socialMediumName={ socialMediumName }
		{ ...restProps }
	/>;
};

TwitterEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

export default TwitterEditorContainer;
