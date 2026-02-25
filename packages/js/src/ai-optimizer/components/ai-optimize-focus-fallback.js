import { useEffect, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import PropTypes from "prop-types";
import { useLocation } from "../../ai-generator/hooks/use-location";

/**
 * Handles focus fallback to the parent analysis section toggle when the AI Optimize
 * button targeted by focusAIFixesButtonId is no longer present in the DOM
 * (e.g. the assessment result was removed after a successful AI fix).
 *
 * This component renders nothing and only runs its effect when a focus request
 * targets an assessment in its section.
 *
 * @param {Object} props The component props.
 * @param {Array}  props.results            The assessment results in this section.
 * @param {string} props.fallbackElementId  The ID of the section toggle element to focus as fallback.
 *
 * @returns {null} This component renders nothing.
 */
const AIOptimizeFocusFallback = ( { results, fallbackElementId } ) => {
	const locationContext = useLocation();
	const focusAIButtonId = useSelect(
		( select ) => select( "yoast-seo/editor" ).getFocusAIFixesButtonId(),
		[]
	);
	const { setFocusAIFixesButtonId } = useDispatch( "yoast-seo/editor" );
	const timerRef = useRef( null );

	useEffect( () => {
		clearTimeout( timerRef.current );

		if ( ! focusAIButtonId || ! fallbackElementId ) {
			return;
		}

		// Only handle focus requests for this location.
		const suffix = `AIFixes-${ locationContext }`;
		if ( ! focusAIButtonId.endsWith( suffix ) ) {
			return;
		}

		// Extract the assessment ID and check if it belongs to this section.
		const assessmentId = focusAIButtonId.slice( 0, -suffix.length );
		if ( ! results.some( ( result ) => result.getIdentifier() === assessmentId ) ) {
			return;
		}

		// Give AIOptimizeButton's useLayoutEffect a chance to handle focus first.
		timerRef.current = setTimeout( () => {
			const button = document.getElementById( focusAIButtonId );
			if ( ! button ) {
				const fallbackElement = document.getElementById( fallbackElementId );
				if ( fallbackElement ) {
					fallbackElement.focus();
				}
				setFocusAIFixesButtonId( null );
			}
		}, 1000 );

		return () => clearTimeout( timerRef.current );
	}, [ focusAIButtonId, locationContext, results, fallbackElementId, setFocusAIFixesButtonId ] );

	return null;
};

AIOptimizeFocusFallback.propTypes = {
	results: PropTypes.array.isRequired,
	fallbackElementId: PropTypes.string.isRequired,
};

export default AIOptimizeFocusFallback;
