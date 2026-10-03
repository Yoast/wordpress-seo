import { Modal } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { SuggestionButton } from "./suggestion-button";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Renders the list of content suggestions.
 *
 * @param {Object} props The component props.
 * @param {Suggestion[]} props.suggestions The list of content suggestions to display.
 * @param {Function} props.onSuggestionClick The function to call when a suggestion is clicked.
 *
 * @returns {JSX.Element} The SuggestionsList component.
 */
export const SuggestionsList = ( { suggestions, onSuggestionClick } ) => (
	<div>
		<Modal.Description className="yst-mb-4">{ __( "Select a suggestion to generate a structured outline for your post.", "wordpress-seo" ) }</Modal.Description>
		{ suggestions.map( ( suggestion, index ) => (
			<SuggestionButton
				key={ `suggestion-${ index }` }
				suggestion={ suggestion }
				onClick={ onSuggestionClick }
			/>
		) ) }
	</div>
);
