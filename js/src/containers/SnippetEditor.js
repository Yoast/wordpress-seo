import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";

/**
 * Returns either the text in the meta description field, the excerpt, or the content.
 *
 * @param {Object} state The redux state.
 *
 * @returns {string} The description to be displayed in the SnippetPreview.
 */
function getDescription( state ) {
	const { excerpt, content } = state.documentData;
	const { description } = state.snippetEditor.data;

	// Set the description to display (empty string will be turned into a placeholder in the SnippetPreview).
	if( description !== "" ) {
		return description;
	} else if ( excerpt !== "" ) {
		return excerpt;
	} else if ( content !== "" ) {
		return content;
	}
	return "";
}

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 *
 * @returns {Object} Data for the `SnippetEditor` component.
 */
export function mapStateToProps( state ) {
	let replacementVariables = state.snippetEditor.replacementVariables;

	// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
	replacementVariables.forEach( ( replaceVariable ) => {
		if( replaceVariable.value === "" ) {
			replaceVariable.value = "%%" + replaceVariable.name + "%%";
		}
	} );

	const generatedDescription = getDescription( state );

	return {
		...state.snippetEditor,
		generatedDescription,
		keyword: state.activeKeyword,
	};
}

/**
 * Maps dispatch function to props for the snippet editor component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `SnippetEditor` component.
 */
export function mapDispatchToProps( dispatch ) {
	return {
		onChange: ( key, value ) => {
			let action = updateData( {
				[ key ]: value,
			} );

			if ( key === "mode" ) {
				action = switchMode( value );
			}

			dispatch( action );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditor );
