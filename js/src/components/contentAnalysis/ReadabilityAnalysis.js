/* global wpseoAdminL10n */
/* External components */
import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { isNil, get } from "lodash-es";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "./Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer } from "../contexts/location";
import HelpLink from "./HelpLink";
import ReadabilityResultsPortal from "../portals/ReadabilityResultsPortal";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const ReadabilityResultsTabContainer = styled.div`
	padding: 16px;
`;

const localizedData = get( window, "wpseoScriptData.metabox", {} );

const StyledHelpLink = styled( HelpLink )`
	margin: -8px 0 -4px 4px;
`;

/**
 * Redux container for the readability analysis.
 */
class ReadabilityAnalysis extends Component {
	/**
	 * Renders the Readability Analysis results.
	 *
	 * @returns {wp.Element} The Readability Analysis results.
	 */
	renderResults() {
		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ wpseoAdminL10n[ "shortlinks.readability_analysis_info" ] }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{ __( "Learn more about the readability analysis", "wordpress-seo" ) }
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<Results
					canChangeLanguage={ ! ( localizedData.settings_link === "" ) }
					showLanguageNotice={ false }
					changeLanguageLink={ localizedData.settings_link }
					language={ localizedData.language }
					results={ this.props.results }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ this.props.marksButtonStatus }
				/>
			</Fragment>
		);
	}

	/**
	 * Renders the Readability Analysis component.
	 *
	 * @returns {wp.Element} The Readability Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );

		if ( isNil( this.props.overallScore ) ) {
			score.className = "loading";
		}

		return (
			<LocationConsumer>
				{ location => {
					if ( location === "sidebar" ) {
						return (
							<Collapsible
								title={ __( "Readability analysis", "wordpress-seo" ) }
								titleScreenReaderText={ score.screenReaderReadabilityText }
								prefixIcon={ getIconForScore( score.className ) }
								prefixIconCollapsed={ getIconForScore( score.className ) }
								id={ `yoast-readability-analysis-collapsible-${ location }` }
							>
								{ this.renderResults() }
							</Collapsible>
						);
					}

					if ( location === "metabox" ) {
						return (
							<ReadabilityResultsPortal target="wpseo-metabox-readability-root">
								<ReadabilityResultsTabContainer>
									<ScoreIconPortal
										target="wpseo-readability-score-icon"
										scoreIndicator={ score.className }
									/>
									{ this.renderResults() }
								</ReadabilityResultsTabContainer>
							</ReadabilityResultsPortal>
						);
					}
				} }
			</LocationConsumer>
		);
	}
}

ReadabilityAnalysis.propTypes = {
	results: PropTypes.array.isRequired,
	marksButtonStatus: PropTypes.string.isRequired,
	overallScore: PropTypes.number,
};

ReadabilityAnalysis.defaultProps = {
	overallScore: null,
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
		results: state.analysis.readability.results || [],
		marksButtonStatus: marksButtonStatus,
		overallScore: state.analysis.readability.overallScore,
	};
}

export default connect( mapStateToProps )( ReadabilityAnalysis );
