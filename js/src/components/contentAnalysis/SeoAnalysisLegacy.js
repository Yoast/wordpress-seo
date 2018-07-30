import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysisLegacy extends React.Component {
	render() {
		return (
			<Results
				showLanguageNotice={ false }
				results={ this.props.results }
				marksButtonClassName="yoast-tooltip yoast-tooltip-s"
				marksButtonStatus={ this.props.marksButtonStatus }
			/>
		);
	}
}

SeoAnalysisLegacy.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	hideMarksButtons: PropTypes.bool,
};

/**
 * Maps redux state to SeoAnalysisLegacy props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to SeoAnalysisLegacy.
 */
function mapStateToProps( state, ownProps ) {
	const marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	let results = null;
	if( state.analysis.seo[ state.focusKeyword ] ) {
		results = state.analysis.seo[ state.focusKeyword ].results;
	}

	return {
		results,
		marksButtonStatus: marksButtonStatus,
	};
}

export default connect( mapStateToProps )( SeoAnalysisLegacy );
