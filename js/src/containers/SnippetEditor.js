import { connect } from "react-redux";
import { SnippetEditor } from "yoast-components";
import {
	switchMode,
	updateData,
} from "../redux/actions/snippetEditor";
import { measureTextWidth } from "yoastseo/js/helpers/createMeasurementElement";
import MetaDescriptionLengthAssessment from "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment";
import PageTitleWidthAssesment from "yoastseo/js/assessments/seo/pageTitleWidthAssessment";
import isUndefined from "lodash/isUndefined";
import get from "lodash/get";
import identity from "lodash/identity";
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
 * Gets the title progress.
 *
 * @param {string} title The title.
 * @param {function} replaceVariables Function that replaces replacement variables.
 *
 * @returns {Object} The title progress.
 */
function getTitleProgress( title, replaceVariables ) {
	// Replace all replacevalues to get the actual title.
	const replacedTitle = replaceVariables( title );
	const titleWidth = measureTextWidth( replacedTitle );
	const pageTitleWidthAssessment = new PageTitleWidthAssesment();
	const score = pageTitleWidthAssessment.calculateScore( titleWidth );
	const maximumLength = pageTitleWidthAssessment.getMaximumLength();
	return {
		max: maximumLength,
		actual: titleWidth,
		score: score,
	};
}

/**
 * Gets the description progress.
 *
 * @param {number}   description      The description.
 * @param {function} replaceVariables Function that replaces replacement variables.
 *
 * @returns {Object} The description progress.
 */
function getDescriptionProgress( description, replaceVariables ) {
	// Replace all replacevalues to get the actual description.
	const replacedDescription = replaceVariables( description );
	const replacedDescriptionLength = replacedDescription.length;

	const metaDescriptionLengthAssessment = new MetaDescriptionLengthAssessment();
	const score = metaDescriptionLengthAssessment.calculateScore( replacedDescriptionLength );
	const maximumLength = metaDescriptionLengthAssessment.getMaximumLength();

	return {
		max: maximumLength,
		actual: replacedDescriptionLength,
		score: score,
	};
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
	const replaceVariables = get( window, [ "YoastSEO", "wp", "replaceVarsPlugin", "replaceVariables" ], identity );
	let titleLengthProgress = getTitleProgress( state.snippetEditor.data.title, replaceVariables );
	let descriptionLengthProgress = getDescriptionProgress( state.snippetEditor.data.description, replaceVariables );

	const replacementVariables = state.snippetEditor.replacementVariables;
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
