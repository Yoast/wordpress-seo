import React from "react";
import { connect } from "react-redux";
import { KeywordSuggestions as RelevantWords } from "yoast-components";

/**
 * Maps the redux state to the RelevantWords component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.linkSuggestions The state for the RelevantWords.
 *
 * @returns {Object} Data for the `RelevantWords` component.
 */
export function mapStateToProps( state ) {
	return {
		relevantWords: state.insights.prominentWords,
	};
}

export default connect( mapStateToProps )( RelevantWords );
