import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useMarker } from "./hooks";
import { transformAnalysisResults } from "./transformers";

/**
 * Handles known data for a readability results component.
 *
 * @param {JSX.Element} as A readability results component.
 * @param {Object} restProps Props to pass to the readability results component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped readability results component.
 */
const ReadabilityResultsContainer = ( { as: Component, ...restProps } ) => {
	const isReadabilityAnalysisActive = useSelect( select => select( SEO_STORE_NAME ).selectIsReadabilityAnalysisActive() );

	// Render nothing when the readability analysis is not active.
	if ( ! isReadabilityAnalysisActive ) {
		return null;
	}

	const readabilityResults = useSelect( select => select( SEO_STORE_NAME ).selectReadabilityResults() );
	const focusKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase() );
	const markerStatus = useSelect( select => select( SEO_STORE_NAME ).selectMarkerStatus() );

	const transformedResults = useMemo( () => transformAnalysisResults( readabilityResults ), [ readabilityResults ] );

	const { markerId, handleMarkClick } = useMarker();

	return <Component
		{ ...transformedResults }
		keywordKey={ focusKeyphrase }
		activeMarker={ markerId }
		onMarkButtonClick={ handleMarkClick }
		headingLevel={ restProps.headingLevel ?? 2 }
		marksButtonClassName={ restProps.marksButtonClassName ?? "yoast-mark-button" }
		marksButtonStatus={ markerStatus }
		{ ...restProps }
	/>;
};

ReadabilityResultsContainer.propTypes = {
	as: PropTypes.elementType.isRequired,
};

ReadabilityResultsContainer.defaultProps = {};

export default ReadabilityResultsContainer;
