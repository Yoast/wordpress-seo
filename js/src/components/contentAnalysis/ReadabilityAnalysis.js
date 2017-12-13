/* global wpseoPostScraperL10n wpseoTermScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Results from "./Results";

let localizedData = {};
if( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}


/**
 * Redux container for the readability analysis.
 */
class ReadabilityAnalysis extends React.Component {
	render() {
		return (
			<Results
				canChangeLanguage={ ! ( localizedData.settings_link === "" ) }
				showLanguageNotice={ true }
				changeLanguageLink={ localizedData.settings_link }
				language={ localizedData.language }
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
