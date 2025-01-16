/* global wpseoAdminL10n */
/* External components */
import { withSelect } from "@wordpress/data";
import { Fragment, createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { isNil } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "../../containers/Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer } from "@yoast/externals/contexts";
import HelpLink from "../HelpLink";
import Portal from "../portals/Portal";
import { Alert, SvgIcon } from "@yoast/components";
import isMultilingualPluginActive from "../../analysis/isMultilingualPluginActive";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const InclusiveLanguageResultsTabContainer = styled.div`
	padding: 16px;
`;

const StyledHelpLink = styled( HelpLink )`
	margin: -8px 0 -4px 4px;
`;

const GoodJobAnalysisResult = styled.p`
	min-height: 24px;
	margin: 12px 0 0 0;
	padding: 0;
	display: flex;
	align-items: flex-start;
`;
const ScoreIcon = styled( SvgIcon )`
	margin: 3px 11px 0 0; // icon 13 + 11 right margin = 24 for the 8px grid.
`;

/**
 * The inclusive language analysis component.
 *
 * @param {Object} props 									The properties.
 *
 * @param {MappedResult[]} props.results 					The assessment results.
 * @param {number} props.overallScore 						The overall analysis score.
 * @param {"enabled"|"disabled"} props.marksButtonStatus 	The status of the mark buttons.
 *
 * @returns {JSX.Element} The inclusive language analysis component.
 */
const InclusiveLanguageAnalysis = ( props ) => {
	const analysisInfoLink = wpseoAdminL10n[ "shortlinks.inclusive_language_analysis_info" ];

	/**
	 * Renders the results of the analysis.
	 *
	 * @returns {JSX.Element} The results of the analysis.
	 */
	function renderResults() {
		const highlightingUpsellLink = "shortlinks.upsell.sidebar.highlighting_inclusive_analysis";

		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ analysisInfoLink }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{
								/* translators: Hidden accessibility text. */
								__( "Learn more about the inclusive language analysis", "wordpress-seo" )
							}
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<Results
					results={ props.results }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ props.marksButtonStatus }
					resultCategoryLabels={ {
						problems: __( "Non-inclusive", "wordpress-seo" ),
						improvements: __( "Potentially non-inclusive", "wordpress-seo" ),
					} }
					highlightingUpsellLink={ highlightingUpsellLink }
					shouldUpsellHighlighting={ props.shouldUpsellHighlighting }
				/>
			</Fragment>
		);
	}

	const goodJobFeedback = createInterpolateElement(
		sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
			__( "%1$sInclusive language%2$s: We haven't detected any potentially non-inclusive phrases. Great work!", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ analysisInfoLink } target="_blank" rel="noreferrer" />,
		}
	);


	/**
	 * Renders a notice that a multilingual plugin has been
	 * detected and the analysis is run in English.
	 *
	 * @returns {JSX.Element} The multilingual plugin detected notice.
	 */
	function renderMultilingualPluginDetectedNotice() {
		const notice = __(
			"We noticed that you are using a multilingual plugin. Please be aware that this analysis feedback is intended only for texts written in English.",
			"wordpress-seo"
		);
		return <Alert type={ "info" }>
			{ notice }
		</Alert>;
	}

	/**
	 * Renders a feedback string for when no non-inclusive phrases are detected.
	 *
	 * @returns {JSX.Element} The feedback string.
	 */
	function renderGoodJob() {
		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ analysisInfoLink }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{
								/* translators: Hidden accessibility text. */
								__( "Learn more about the inclusive language analysis", "wordpress-seo" )
							}
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<GoodJobAnalysisResult>
					<ScoreIcon
						icon={ "circle" }
						color={ "#7ad03a" }
						size="13px"
					/>
					<span>{ goodJobFeedback }</span>
				</GoodJobAnalysisResult>
			</Fragment>
		);
	}

	/**
	 * Renders the inclusive language analysis for the sidebar.
	 *
	 * @param {Array} results 					The inclusive language assessment results.
	 * @param {number} inclusiveLanguageScore 	The inclusive language score.
	 *
	 * @returns {JSX.Element} The inclusive language for the sidebar.
	 */
	function renderSidebar( results, inclusiveLanguageScore ) {
		return (
			<Collapsible
				title={ __( "Inclusive language", "wordpress-seo" ) }
				titleScreenReaderText={ inclusiveLanguageScore.screenReaderInclusiveLanguageText }
				prefixIcon={ getIconForScore( inclusiveLanguageScore.className ) }
				prefixIconCollapsed={ getIconForScore( inclusiveLanguageScore.className ) }
				id={ "yoast-inclusive-language-analysis-collapsible-sidebar" }
			>
				{ isMultilingualPluginActive() ? renderMultilingualPluginDetectedNotice() : null }
				{ results.length >= 1 ? renderResults() : renderGoodJob() }
			</Collapsible>
		);
	}

	/**
	 * Renders the inclusive language analysis for the metabox.
	 *
	 * @param {Array} results 					The inclusive language assessment results.
	 * @param {number} inclusiveLanguageScore 	The inclusive language score.
	 *
	 * @returns {JSX.Element} The inclusive language for the metabox.
	 */
	function renderMetabox( results, inclusiveLanguageScore ) {
		return (
			<Portal target="wpseo-metabox-inclusive-language-root">
				<InclusiveLanguageResultsTabContainer>
					<ScoreIconPortal
						target="wpseo-inclusive-language-score-icon"
						scoreIndicator={ inclusiveLanguageScore.className }
					/>
					{ isMultilingualPluginActive() ? renderMultilingualPluginDetectedNotice() : null }
					{ results.length >= 1 ? renderResults() : renderGoodJob() }
				</InclusiveLanguageResultsTabContainer>
			</Portal>
		);
	}

	const score = getIndicatorForScore( props.overallScore );

	if ( isNil( props.overallScore ) ) {
		score.className = "loading";
	}

	return (
		<LocationConsumer>
			{ location => {
				if ( location === "sidebar" ) {
					return renderSidebar( props.results, score );
				}

				if ( location === "metabox" ) {
					return renderMetabox( props.results, score );
				}
			} }
		</LocationConsumer>
	);
};

InclusiveLanguageAnalysis.propTypes = {
	results: PropTypes.array,
	// `marksButtonStatus` is used, but not recognized by ESLint.
	marksButtonStatus: PropTypes.oneOf( [ "enabled", "disabled", "hidden" ] ).isRequired,
	overallScore: PropTypes.number,
	shouldUpsellHighlighting: PropTypes.bool,
};

InclusiveLanguageAnalysis.defaultProps = {
	results: [],
	overallScore: null,
	shouldUpsellHighlighting: false,
};

export default withSelect( select => {
	const {
		getInclusiveLanguageResults,
		getMarkButtonStatus,
	} = select( "yoast-seo/editor" );

	return {
		...getInclusiveLanguageResults(),
		marksButtonStatus: getMarkButtonStatus(),
	};
} )( InclusiveLanguageAnalysis );
