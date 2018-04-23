import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 *
 * @returns {Object} Data suitable for the `SnippetEditor` component.
 */
function mapStateToProps( { snippetEditor } ) {
	const data = snippetEditor.data;

	return {
		data: data,
		mode: snippetEditor.mode,
		replacementVariables: snippetEditor.replacementVariables,
	};
}

/**
 * Maps dispatch function to props for the snippet editor component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props suitable for the `SnippetEditor` component.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onChange: ( key, value ) => {
			if ( key === "mode" ) {
				dispatch( switchMode( value ) );
			}

			dispatch( updateData( {
				[ key ]: value,
			} ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditor );
