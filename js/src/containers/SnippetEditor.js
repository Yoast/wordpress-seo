import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";
import isUndefined from "lodash/isUndefined";
import { getResultsForKeyword, getActiveKeyword } from "../redux/selectors/results";

/**
 * Returns true for the title length result.
 *
 * @param {array} results The SEO results.
 * @returns {boolean} True if it's the title length result.
 */
function isTitleLengthResult( results ) {
	return results._identifier === "titleWidth";
}

/**
 * Returns true for the description length result.
 *
 * @param {array} results The SEO results.
 * @returns {boolean} True if it's the description length result.
 */
function isDescriptionLengthResult( results ) {
	return results._identifier === "metaDescriptionLength";
}

/**
 *	Gets the data needed for calculating the length progress.
 *
 * @param {Object} result The assessment result.
 * @returns {Object} The data needed for calculating the length progress.
 */
function getProgress( result ) {
	let progress = {};
	if ( ! isUndefined( result ) ) {
		progress = {
			max: result.max,
			actual: result.actual,
			score: result.score,
		};
	}
	return progress;
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
	let activeKeyword = getActiveKeyword( state );
	let seoResults = getResultsForKeyword( state, activeKeyword );

	let titleLengthResult = seoResults.find( isTitleLengthResult );
	let descriptionLengthResult = seoResults.find( isDescriptionLengthResult );

	let titleLengthProgress = getProgress( titleLengthResult );
	let descriptionLengthProgress = getProgress( descriptionLengthResult );
	let replacementVariables = state.snippetEditor.replacementVariables;

	// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
	replacementVariables.forEach( ( replaceVariable ) => {
		if( replaceVariable.value === "" ) {
			replaceVariable.value = "%%" + replaceVariable.name + "%%";
		}
	} );

	return {
		...state.snippetEditor,
		titleLengthProgress,
		descriptionLengthProgress,
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
