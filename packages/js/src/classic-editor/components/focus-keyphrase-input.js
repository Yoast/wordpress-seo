import { PropTypes } from "prop-types";
import { useDispatch, useSelect } from "@wordpress/data";
import { useDebounce } from "@wordpress/compose";
import { useCallback } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-integration";

import { EDITOR_STORE_NAME } from "../editor-store";
import { KeywordInput } from "../../components/contentAnalysis/KeywordInput";

/**
 * Creates the focus keyphrase input component.
 *
 * @param {string} focusKeyphraseInfoLink The URL for the help link.
 *
 * @returns {JSX.Element} The focus keyphrase input.
 */
const FocusKeyphraseInput = ( { focusKeyphraseInfoLink } ) => {
	const focusKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase() );
	const displayNoKeyphraseMessage = useSelect( select => select( EDITOR_STORE_NAME ).getSEMrushNoKeyphraseMessage() );
	const displayNoKeyphraseForTrackingMessage = useSelect( select => select( EDITOR_STORE_NAME ).hasWincherNoKeyphrase() );
	const isSEMrushIntegrationActive = useSelect( select => select( EDITOR_STORE_NAME ).getIsSEMrushIntegrationActive() );
	const { updateKeyphrase } = useDispatch( SEO_STORE_NAME );
	const { setMarkerPauseStatus } = useDispatch( EDITOR_STORE_NAME );

	const handleFocusKeyphraseChange = useCallback( keyphrase => updateKeyphrase( { keyphrase } ), [ updateKeyphrase ] );

	const pauseMarker = useCallback( () => setMarkerPauseStatus( true ), [ setMarkerPauseStatus ] );
	const startMarker = useCallback( () => setMarkerPauseStatus( false ), [ setMarkerPauseStatus ] );

	return (
		<KeywordInput
			keyword={ focusKeyphrase }
			displayNoKeyphraseMessage={ displayNoKeyphraseMessage }
			displayNoKeyphraseForTrackingMessage={ displayNoKeyphraseForTrackingMessage }
			isSEMrushIntegrationActive={ isSEMrushIntegrationActive }
			helpLink={ focusKeyphraseInfoLink }
			onFocusKeywordChange={ useDebounce( handleFocusKeyphraseChange ) }
			onFocusKeyword={ pauseMarker }
			onBlurKeyword={ startMarker }
		/>
	);
};

FocusKeyphraseInput.propTypes = {
	focusKeyphraseInfoLink: PropTypes.string.isRequired,
};

export default FocusKeyphraseInput;
