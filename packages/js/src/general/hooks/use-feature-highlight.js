import { useState, useEffect } from "@wordpress/element";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Reads a one-shot feature-highlight signal from the router location state.
 *
 * The signal is consumed on mount, so a refresh or back/forward navigation does not re-trigger the highlight.
 *
 * @param {string} highlightValue The location-state highlight value that activates the highlight.
 *
 * @returns {[boolean, Function]} Whether the highlight is active, and a setter to dismiss it.
 */
export const useFeatureHighlight = ( highlightValue ) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [ isHighlighting, setIsHighlighting ] = useState( () => location.state?.highlight === highlightValue );

	useEffect( () => {
		// Consume the one-shot highlight signal so a refresh or back/forward navigation does not re-trigger it.
		if ( location.state?.highlight ) {
			navigate( location.pathname, { replace: true, state: null } );
		}
	}, [] );

	return [ isHighlighting, setIsHighlighting ];
};
