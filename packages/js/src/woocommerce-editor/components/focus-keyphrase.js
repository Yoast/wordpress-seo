import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { KeywordInput } from "../../components/contentAnalysis/KeywordInput";
import { STORES } from "../constants";

/**
 * @param {string} value The focus keyphrase.
 * @param {function} onChange The callback to update the focus keyphrase.
 * @param {Object} props The rest of the props.
 * @returns {JSX.Element} The element.
 */
export const FocusKeyphrase = ( { value, onChange, ...props } ) => {
	const displayNoKeyphraseMessage = useSelect( select => select( STORES.editor ).getSEMrushNoKeyphraseMessage(), [] );
	const displayNoKeyphrasForTrackingMessage = useSelect( select => select( STORES.editor ).hasWincherNoKeyphrase(), [] );
	const errors = useSelect( select => select( STORES.editor ).getFocusKeyphraseErrors(), [] );
	const { setMarkerPauseStatus } = useDispatch( STORES.editor );

	const handleFocus = useCallback( () => setMarkerPauseStatus( true ), [ setMarkerPauseStatus ] );
	const handleBlur = useCallback( () => setMarkerPauseStatus( false ), [ setMarkerPauseStatus ] );

	return <KeywordInput
		keyword={ value }
		onFocusKeywordChange={ onChange }
		displayNoKeyphraseMessage={ displayNoKeyphraseMessage }
		displayNoKeyphrasForTrackingMessage={ displayNoKeyphrasForTrackingMessage }
		errors={ errors }
		onFocusKeyword={ handleFocus }
		onBlurKeyword={ handleBlur }
		{ ...props }
	/>;
};
