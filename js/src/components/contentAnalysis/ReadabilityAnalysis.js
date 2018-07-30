/* global wpseoPostScraperL10n wpseoTermScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";

import Results from "./Results";
import { Collapsible } from "yoast-components";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 1.5em 0 1em;
	display: block;
`;

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
			<Collapsible
				title="Readability analysis"
				initialIsOpen={ false }
			>
				<AnalysisHeader>
					Analysis results:
				</AnalysisHeader>
				<Results
					canChangeLanguage={ ! ( localizedData.settings_link === "" ) }
					showLanguageNotice={ true }
					changeLanguageLink={ localizedData.settings_link }
					language={ localizedData.language }
					results={ this.props.results }
					marksButtonClassName="yoast-tooltip yoast-tooltip-s"
					marksButtonStatus={ this.props.marksButtonStatus }
				/>
			</Collapsible>
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
