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

	let generatedDescription = getDescription( state );

	return {
		...state.snippetEditor,
		generatedDescription,
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
