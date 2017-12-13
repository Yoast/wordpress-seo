import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysis extends React.Component {
	render() {
		return (
			<Results
				showLanguageNotice={ false }
				results={ this.props.results } />
		);
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
};

/**
 * Maps redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state ) {
	if ( state.analysis.seo[ state.activeKeyword ] ) {
		return {
			results: state.analysis.seo[ state.activeKeyword ],
		};
	}
	return { results: null };
}

export default connect( mapStateToProps )( SeoAnalysis );
