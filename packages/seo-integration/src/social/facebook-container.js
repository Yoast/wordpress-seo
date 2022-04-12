import { useDispatch, useSelect } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { filter, get, map } from "lodash";
import { PropTypes } from "prop-types";
import { useSeoContext } from "../seo-context";

/**
 * Formats the replacement variables for the Facebook preview.
 *
 * Caches the given replacement variables so that the memory address only changes when any value changes.
 *
 * @returns {{replacementVariables: {name: string, label: string, value: *}[], recommendedReplacementVariables: string[]}} The replacement variables
 *     and recommended replacement variables.
 */
const useFacebookPreviewReplacementVariables = () => {
	const analysisType = useSelect( select => select( SEO_STORE_NAME ).selectAnalysisType() );
	const { analysisTypeReplacementVariables } = useSeoContext();
	const replacementVariables = get( analysisTypeReplacementVariables, `${ analysisType }.variables`, [] );

	const cache = useRef();

	const values = map( replacementVariables, variable => variable.getReplacement() ).join( "" );
	const cachedValues = map( cache.current?.replacementVariables, "value" ).join( "" );

	// Set the cache when any value changed, or when it was not set before.
	if ( cachedValues !== values || ! cache.current ) {
		cache.current = {
			replacementVariables: map( replacementVariables, replacementVariable => ( {
				name: replacementVariable.name,
				label: replacementVariable.label,
				value: replacementVariable.getReplacement(),
				hidden: ! replacementVariable.isVisible,
			} ) ),
			recommendedReplacementVariables: map( filter( replacementVariables, "isRecommended" ), "name" ),
		};
	}

	return cache.current;
};


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

	const { replacementVariables, recommendedReplacementVariables } = useFacebookPreviewReplacementVariables();

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
	/>
}

FacebookEditorContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

// FacebookEditorContainer.defaultProps = {};

export default FacebookEditorContainer;
