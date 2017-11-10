/* global wpseoPostScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";

class ContentAnalysis extends React.Component {
	render() {
		debugger;
		return <Results
			showLanguageNotice={ true }
			changeLanguageLink={ wpseoPostScraperL10n.settings_link }
			language={ wpseoPostScraperL10n.language }
			results={ this.props.results }/>
	}
}

ContentAnalysis.propTypes = {
	results: PropTypes.array,
};

/**
 * Map redux state to ContentAnalysis props.
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

export default connect( mapStateToProps )( ContentAnalysis );
