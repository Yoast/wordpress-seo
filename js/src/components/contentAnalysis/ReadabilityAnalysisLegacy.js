/* global wpseoPostScraperL10n wpseoTermScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import get from "lodash/get";

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
				canChangeLanguage={ localizedData && get( localizedData, [ "settings_link" ] ) }
				showLanguageNotice={ true }
				changeLanguageLink={ localizedData.settings_link }
				language={ localizedData.language }
				results={ this.props.results }
				marksButtonClassName="yoast-tooltip yoast-tooltip-s"
				marksButtonStatus={ this.props.marksButtonStatus }
			/>
		);
	}
}

ReadabilityAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	hideMarksButtons: PropTypes.bool,
};

/**
 * Maps redux state to ContentAnalysis props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to ContentAnalysis.
 */
function mapStateToProps( state, ownProps ) {
	const marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	return {
		results: state.analysis.readability.results,
		marksButtonStatus: marksButtonStatus,
	};
}

export default connect( mapStateToProps )( ReadabilityAnalysis );
