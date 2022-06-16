import { useDispatch, useSelect } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useReplacementVariables } from "../../hooks/useReplacementVariables";

/**
 * Handles known data for a Facebook editor component.
 *
 * @param {JSX.Element} as A Facebook editor component.
 * @param {Object} restProps Props to pass to the Facebook editor component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped Facebook editor component.
 */
const FacebookEditorContainer = ( { as: Component, ...restProps } ) => {
	const facebookTitle = useSelect( select => select( SEO_STORE_NAME ).selectFacebookTitle() );
	const facebookDescription = useSelect( select => select( SEO_STORE_NAME ).selectFacebookDescription() );
	const facebookImageUrl = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImageURL() );
	const facebookImageAlt = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImage() ).alt;
	const socialDescriptionTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialDescriptionTemplate() );
	const contentDescription = useSelect( select => select( SEO_STORE_NAME ).selectMetaDescription() );
	const contentExcerpt = useSelect( select => select( SEO_STORE_NAME ).selectExcerpt() );
	const socialTitleTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialTitleTemplate() );
	const seoTitle = useSelect( select=> select( SEO_STORE_NAME ).selectSeoTitle() );
	const seoTitleTemplate = useSelect( select => select( SEO_STORE_NAME ).selectTitleTemplate() );
	const seoDescriptionTemplate = useSelect( select => select( SEO_STORE_NAME ).selectDescriptionTemplate() );

	const { updateFacebookTitle, updateFacebookDescription } = useDispatch( SEO_STORE_NAME );
	const socialMediumName = "Facebook";

	const { replacementVariables, recommendedReplacementVariables } = useReplacementVariables();

	return <Component
		title={ facebookTitle }
		description={ facebookDescription }
		imageUrl={ facebookImageUrl }
		alt={ facebookImageAlt }
		onTitleChange={ updateFacebookTitle }
		onDescriptionChange={ updateFacebookDescription }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		titleInputPlaceholder={ "" }
		descriptionInputPlaceholder={ "" }
		descriptionPreviewFallback={ socialDescriptionTemplate || contentDescription || seoDescriptionTemplate || contentExcerpt || "" }
		titlePreviewFallback={ socialTitleTemplate || seoTitle || seoTitleTemplate || "" }
		socialMediumName={ socialMediumName }
		{ ...restProps }
	/>;
};

FacebookEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

export default FacebookEditorContainer;
