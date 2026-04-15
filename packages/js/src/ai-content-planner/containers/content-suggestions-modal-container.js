import { useSelect } from "@wordpress/data";
import { CONTENT_PLANNER_STORE } from "../constants";
import { ContentSuggestionsModal } from "../components/content-suggestions-modal";

/**
 * Container component that connects the ContentSuggestionsModal to the store.
 *
 * @param {Object} props The component props, forwarded to ContentSuggestionsModal.
 *
 * @returns {JSX.Element} The ContentSuggestionsModal with store data injected.
 */
export const ContentSuggestionsModalContainer = ( props ) => {
	const suggestions = useSelect( ( select ) => select( CONTENT_PLANNER_STORE ).selectSuggestions(), [] );

	return <ContentSuggestionsModal suggestions={ suggestions } { ...props } />;
};
