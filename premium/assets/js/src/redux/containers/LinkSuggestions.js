import React from "react";
import { connect } from "react-redux";
import LinkSuggestionsMetabox from "../../components/LinkSuggestions";

/**
 * Maps the redux state to the LinkSuggestions component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.linkSuggestions The state for the linkSuggestions.
 *
 * @returns {Object} Data for the `LinkSuggestionsMetabox` component.
 */
export function mapStateToProps( state ) {
	return state.linkSuggestions;
}

export default connect( mapStateToProps )( LinkSuggestionsMetabox );
