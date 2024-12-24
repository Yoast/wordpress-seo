/* global wpseoAdminL10n */
/* External components */
import { Component, Fragment } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { isNil } from "lodash";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "../../containers/Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer, RootContext } from "@yoast/externals/contexts";
import HelpLink from "../HelpLink";
import ReadabilityResultsPortal from "../portals/ReadabilityResultsPortal";
import { isWordComplexitySupported } from "../../helpers/assessmentUpsellHelpers";
import { addQueryArgs } from "@wordpress/url";
import getL10nObject from "../../analysis/getL10nObject";
import isBlockEditor from "../../helpers/isBlockEditor";
import AIAssessmentFixesButton from "../../ai-assessment-fixes/components/ai-assessment-fixes-button";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const ReadabilityResultsTabContainer = styled.div`
	padding: 16px;
`;

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
	 * @param {Array} upsellResults The array of upsell results.
	 *
	 * @returns {wp.Element} The Readability Analysis results.
	 */
	renderResults( upsellResults ) {
		const highlightingUpsellLink = "shortlinks.upsell.sidebar.highlighting_readability_analysis";

		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ wpseoAdminL10n[ "shortlinks.readability_analysis_info" ] }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{
								/* translators: Hidden accessibility text. */
								__( "Learn more about the readability analysis", "wordpress-seo" )
							}
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<Results
					results={ this.props.results }
					upsellResults={ upsellResults }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ this.props.marksButtonStatus }
					highlightingUpsellLink={ highlightingUpsellLink }
					shouldUpsellHighlighting={ this.props.shouldUpsellHighlighting }
					renderAIFixesButton={ this.renderAIFixesButton }
				/>
			</Fragment>
		);
	}

	/**
	 * Returns the list of results used to upsell the user to Premium.
	 *
	 * @param {string} location 		Where this component is rendered (metabox or sidebar).
	 * @param {string} locationContext 	In which editor this component is rendered.
	 *
	 * @returns {Array} The upsell results.
	 */
	getUpsellResults( location, locationContext ) {
		let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.word_complexity" ];
		if ( location === "sidebar" ) {
			link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.word_complexity" ];
		}

		link = addQueryArgs( link, { context: locationContext } );

		/*
		 * We don't show the upsell for Word complexity assessment if it's not supported for the current locale.
		 */
		if ( ! isWordComplexitySupported() ) {
			return [];
		}

		const wordComplexityUpsellText = sprintf(
			/* Translators: %1$s is a span tag that adds styling to 'Word complexity', %2$s is a closing span tag.
			   %3$s is an anchor tag with a link to yoast.com, %4$s is a closing anchor tag.*/
			__(
				"%1$sWord complexity%2$s: Is your vocabulary suited for a larger audience? %3$sYoast SEO Premium will tell you!%4$s",
				"wordpress-seo"
			),
			"<span style='text-decoration: underline'>",
			"</span>",
			`<a href="${ link }" data-action="load-nfd-ctb" data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2" target="_blank">`,
			"</a>"
		);

		return [
			{
				score: 0,
				rating: "upsell",
				hasMarks: false,
				id: "wordComplexity",
				text: wordComplexityUpsellText,
				markerId: "wordComplexity",
			},
		];
	}

	/* eslint-disable complexity */
	/**
	 * Renders the Yoast AI Optimize button.
	 * The button is shown when:
	 * - The assessment can be fixed through Yoast AI Optimize.
	 * - The AI feature is enabled (for Yoast SEO Premium users; for Free users, the button is shown with an upsell).
	 * - We are in the block editor.
	 * - We are not in the Elementor editor, nor in the Elementor in-between screen.
	 *
	 * @param {boolean} hasAIFixes Whether the assessment can be fixed through Yoast AI Optimize.
	 * @param {string} id The assessment ID.
	 *
	 * @returns {void|JSX.Element} The AI Optimize button, or nothing if the button should not be shown.
	 */
	renderAIFixesButton = ( hasAIFixes, id ) => {
		const { isElementor, isAiFeatureEnabled } = this.props;
		const isPremium = getL10nObject().isPremium;

		// Don't show the button if the AI feature is not enabled for Yoast SEO Premium users.
		if ( isPremium && ! isAiFeatureEnabled ) {
			return;
		}

		const isElementorEditorPageActive =  document.body.classList.contains( "elementor-editor-active" );
		const isNotElementorPage =  ! isElementor && ! isElementorEditorPageActive;

		// The reason of adding the check if Elementor is active or not is because `isBlockEditor` method also returns `true` for Elementor.
		// The reason of adding the check if the Elementor editor is active, is to stop showing the buttons in the in-between screen.
		return hasAIFixes && isBlockEditor() && isNotElementorPage && (
			<AIAssessmentFixesButton id={ id } isPremium={ isPremium } />
		);
	};
	/* eslint-enable complexity */

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
					return (
						<RootContext.Consumer>
							{ ( { locationContext } ) => {
								let upsellResults = [];
								if ( this.props.shouldUpsell ) {
									upsellResults = this.getUpsellResults( location, locationContext );
								}
								if ( location === "sidebar" ) {
									return (
										<Collapsible
											title={ __( "Readability analysis", "wordpress-seo" ) }
											titleScreenReaderText={ score.screenReaderReadabilityText }
											prefixIcon={ getIconForScore( score.className ) }
											prefixIconCollapsed={ getIconForScore( score.className ) }
											id={ `yoast-readability-analysis-collapsible-${ location }` }
										>
											{ this.renderResults( upsellResults ) }
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
												{ this.renderResults( upsellResults ) }
											</ReadabilityResultsTabContainer>
										</ReadabilityResultsPortal>
									);
								}
							} }
						</RootContext.Consumer>
					);
				} }
			</LocationConsumer>
		);
	}
}

ReadabilityAnalysis.propTypes = {
	results: PropTypes.array.isRequired,
	marksButtonStatus: PropTypes.string.isRequired,
	overallScore: PropTypes.number,
	shouldUpsell: PropTypes.bool,
	shouldUpsellHighlighting: PropTypes.bool,
	isAiFeatureEnabled: PropTypes.bool,
	isElementor: PropTypes.bool,
};

ReadabilityAnalysis.defaultProps = {
	overallScore: null,
	shouldUpsell: false,
	shouldUpsellHighlighting: false,
	isAiFeatureEnabled: false,
	isElementor: false,
};

export default withSelect( select => {
	const {
		getReadabilityResults,
		getMarkButtonStatus,
		getIsElementorEditor,
		getIsAiFeatureEnabled,
	} = select( "yoast-seo/editor" );

	return {
		...getReadabilityResults(),
		marksButtonStatus: getMarkButtonStatus(),
		isElementor: getIsElementorEditor(),
		isAiFeatureEnabled: getIsAiFeatureEnabled(),
	};
} )( ReadabilityAnalysis );
