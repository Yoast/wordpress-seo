/* global wpseoPostScraperL10n wpseoTermScraperL10n wpseoAdminL10n */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { utils } from "yoast-components";
import isNil from "lodash/isNil";

import Results from "./Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

let localizedData = {};
if( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

const { makeOutboundLink } = utils;
const LearnMoreLink = makeOutboundLink();

/**
 * Redux container for the readability analysis.
 */
class ReadabilityAnalysis extends React.Component {
	render() {
		const score = getIndicatorForScore( this.props.overallScore );

		if ( isNil( this.props.overallScore ) ) {
			score.className = "loading";
		}

		// Sort the results alphabetically by their identifier.
		let sortedResults = this.props.results;
		if ( this.props.results ) {
			sortedResults = this.props.results.sort( ( a, b ) => a._identifier.localeCompare( b._identifier ) );
		}

		return (
			<Collapsible
				title={ __( "Readability analysis", "wordpress-seo" ) }
				titleScreenReaderText={ score.screenReaderReadabilityText }
				prefixIcon={ getIconForScore( score.className ) }
				prefixIconCollapsed={ getIconForScore( score.className ) }
			>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
				</AnalysisHeader>
				<p>{ __( "This analysis checks your writing for grammar and writing style so your content " +
						"is as clear as it can be.", "wordpress-seo" ) + " " }
					<LearnMoreLink href={ wpseoAdminL10n[ "shortlinks.readability_analysis_info" ] } rel={ null }>
						{ __( "Learn more about the readability analysis.", "wordpress-seo" ) }
					</LearnMoreLink>
				</p>
				<Results
					canChangeLanguage={ ! ( localizedData.settings_link === "" ) }
					showLanguageNotice={ true }
					changeLanguageLink={ localizedData.settings_link }
					language={ localizedData.language }
					results={ sortedResults }
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
