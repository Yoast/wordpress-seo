/* global wpseoPostScraperL10n wpseoTermScraperL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import colors from "yoast-components/style-guide/colors.json";

import Results from "./Results";
import { Collapsible } from "yoast-components";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";

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

	getIconForScore( score ) {
		switch( score ) {
			case "good":
				return { icon: "seo-score-good", color: colors.$color_green_medium };
			case "ok":
				return { icon: "seo-score-ok", color: colors.$color_yellow_score };
			case "bad":
				return { icon: "seo-score-bad", color: colors.$color_red };
			default:
				return { icon: "seo-score-none", color: colors.$color_grey_disabled };
		}
	}


	render() {
		const score = getIndicatorForScore( this.props.overallScore );
		console.log( score )
		return (
			<Collapsible
				title={ "Readability analysis" }
				initialIsOpen={ false }
				titleScreenReaderText={ score.screenReaderReadabilityText }
				prefixIcon={ this.getIconForScore( score.className ) }
				prefixIconCollapsed={ this.getIconForScore( score.className ) }
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
	overallScore: PropTypes.number,
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
		overallScore: state.analysis.readability.overallScore,
	};
}

export default connect( mapStateToProps )( ReadabilityAnalysis );
