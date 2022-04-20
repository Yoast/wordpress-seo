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
	const title = useSelect( select => select( SEO_STORE_NAME ).selectTwitterTitle() );
	const description = useSelect( select => select( SEO_STORE_NAME ).selectTwitterDescription() );
	const imageData = useSelect( select => select( SEO_STORE_NAME ).selectTwitterImage() );
	const imageUrl = imageData.url;
	const imageAlt = imageData.alt;
	const { updateTwitterTitle, updateTwitterDescription } = useDispatch( SEO_STORE_NAME );
	const titleInputPlaceholder = "";
	const descriptionInputPlaceholder = "";
	const socialMediumName = "Twitter";

	const { replacementVariables, recommendedReplacementVariables } = useReplacementVariables();

	return <Component
		title={ title }
		description={ description }
		imageUrl={ imageUrl }
		alt={ imageAlt }
		isLarge={ imageIsLarge }
		onTitleChange={ updateTwitterTitle }
		onDescriptionChange={ updateTwitterDescription }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		titleInputPlaceholder={ titleInputPlaceholder }
		descriptionInputPlaceholder={ descriptionInputPlaceholder }
		socialMediumName={ socialMediumName }
		{ ...restProps }
	/>;
};

TwitterEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

export default TwitterEditorContainer;
