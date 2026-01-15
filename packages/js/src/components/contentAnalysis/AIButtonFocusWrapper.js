import PropTypes from "prop-types";
import useAIButtonFocusFallback from "../../hooks/use-ai-button-focus-fallback";

/**
 * Wrapper component that manages focus for AI Optimize buttons.
 *
 * This component uses the useAIButtonFocusFallback hook to handle focus management
 * when AI Optimize buttons are interacted with. When a button is removed from the DOM
 * (after applying suggestions), focus moves to a fallback element instead of jumping
 * to the beginning of the page.
 *
 * @param {Object} props The component props.
 * @param {React.ReactNode} props.children The child components to render.
 * @param {Array} props.results The assessment results for this section.
 * @param {string} props.fallbackElementId The ID of the element to focus when the AI button is removed.
 *
 * @returns {JSX.Element} The children wrapped with focus management functionality.
 */
const AIButtonFocusWrapper = ( { children, results, fallbackElementId } ) => {
	useAIButtonFocusFallback( {
		results,
		fallbackElementId,
	} );

	return children;
};

AIButtonFocusWrapper.propTypes = {
	children: PropTypes.node.isRequired,
	results: PropTypes.array,
	fallbackElementId: PropTypes.string.isRequired,
};

AIButtonFocusWrapper.defaultProps = {
	results: [],
};

export default AIButtonFocusWrapper;
