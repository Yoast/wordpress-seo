/* global wpseoPostScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";

/**
 * Redux container for the readability analysis.
 */
class ReadabilityAnalysis extends React.Component {
	render() {
		return (
			<Results
				showLanguageNotice={ ! ( wpseoPostScraperL10n.settings_link === "" ) }
				changeLanguageLink={ wpseoPostScraperL10n.settings_link }
				language={ wpseoPostScraperL10n.language }
				results={ this.props.results } />
		);
	}
}

ReadabilityAnalysis.propTypes = {
	results: PropTypes.array,
};

/**
 * Maps redux state to ContentAnalysis props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to ContentAnalysis.
 */
function mapStateToProps( state ) {
	return {
		results: state.analysis.readability,
	};
}

export default connect( mapStateToProps )( ReadabilityAnalysis );
