import { useDispatch, useSelect } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useReplacementVariables } from "../../hooks/useReplacementVariables";

const FacebookEditorContainer = ( { as: Component, ...restProps } ) => {
	const title = useSelect( select => select( SEO_STORE_NAME ).selectFacebookTitle() );
	const description = useSelect( select => select( SEO_STORE_NAME ).selectFacebookDescription() );
	const imageData = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImage() );
	const imageUrl = imageData.url;
	const imageAlt = imageData.alt;
	const { updateFacebookTitle, updateFacebookDescription } = useDispatch( SEO_STORE_NAME );
	const titleInputPlaceholder  = "";
	const descriptionInputPlaceholder  = "";
	const socialMediumName = "Facebook";

	const { replacementVariables, recommendedReplacementVariables } = useReplacementVariables();

	return <Component
		title={ title }
		description={ description }
		imageUrl={ imageUrl }
		alt={ imageAlt }
		onTitleChange={ updateFacebookTitle }
		onDescriptionChange={ updateFacebookDescription }
		replacementVariables={ replacementVariables }
		recommendedReplacementVariables={ recommendedReplacementVariables }
		titleInputplaceholder={ titleInputPlaceholder }
		descriptionInputPlaceholder={ descriptionInputPlaceholder }
		socialMediumName={ socialMediumName }
		{ ...restProps }
	/>;
};

FacebookEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

export default FacebookEditorContainer;
