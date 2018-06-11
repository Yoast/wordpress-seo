import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";
import { updateAnalysisData } from "../redux/actions/analysisData";

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

	return {
		...state.snippetEditor,
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
		onChangeAnalysisData: ( analysisData ) => {
			dispatch( updateAnalysisData( analysisData ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditor );
