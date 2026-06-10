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

	// Run once on mount: this is a one-shot consume, so it must not re-fire on later navigations.
	useEffect( () => {
		if ( ! location.state?.highlight ) {
			return;
		}

		// Strip only the highlight key, preserving any other state plus the current search and hash.
		const remainingState = { ...location.state };
		delete remainingState.highlight;

		navigate(
			{ pathname: location.pathname, search: location.search, hash: location.hash },
			{ replace: true, state: Object.keys( remainingState ).length > 0 ? remainingState : null }
		);
	}, [] );

	return [ isHighlighting, setIsHighlighting ];
};
