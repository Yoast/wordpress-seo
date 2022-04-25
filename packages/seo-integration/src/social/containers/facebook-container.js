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
	const imageData = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImage() );
	const imageUrl = imageData.url;
	const imageAlt = imageData.alt;
	const socialDescriptionTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialDescTemplate() );
	// The content description retrieved from the store already has fallback options.
	const contentDescription = useSelect( select => select( SEO_STORE_NAME ).selectMetaDescription() );
	const contentExcerpt = useSelect( select => select( SEO_STORE_NAME ).selectExcerpt() );
	const socialTitleTemplate = useSelect( select => select( SEO_STORE_NAME ).selectSocialTitleTemplate() );
	// The content description retrieved from the store already has fallback options.
	const seoTitle = useSelect( select=> select( SEO_STORE_NAME ).selectSeoTitle() );
	const { updateFacebookTitle, updateFacebookDescription } = useDispatch( SEO_STORE_NAME );
	const socialMediumName = "Facebook";

	const { replacementVariables, recommendedReplacementVariables } = useReplacementVariables();

	return <Component
		title={ facebookTitle }
		description={ facebookDescription }
		imageUrl={ imageUrl }
		alt={ imageAlt }
		onTitleChange={ updateFacebookTitle }
		onDescriptionChange={ updateFacebookDescription }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		titleInputPlaceholder={ "" }
		descriptionInputPlaceholder={ "" }
		descriptionPreviewFallback={ socialDescriptionTemplate || contentDescription || contentExcerpt || "" }
		titlePreviewFallback={ socialTitleTemplate || seoTitle || "" }
		socialMediumName={ socialMediumName }
		{ ...restProps }
	/>;
};

FacebookEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

export default FacebookEditorContainer;
