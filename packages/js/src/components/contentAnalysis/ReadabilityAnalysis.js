/* global wpseoAdminL10n */
/* External components */
import { Component, Fragment } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { isNil, noop } from "lodash-es";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "../../containers/Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer } from "@yoast/externals/contexts";
import HelpLink from "../HelpLink";
import ReadabilityResultsPortal from "../portals/ReadabilityResultsPortal";
import { AnalysisResult } from "@yoast/analysis-report";
import { icons } from "@yoast/components";
import { isWordComplexitySupported } from "../../helpers/assessmentUpsellHelpers";

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
					results={ this.props.results }
					upsellResults={ upsellResults }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ this.props.marksButtonStatus }
				/>
			</Fragment>
		);
	}

	/**
	 * Returns the list of results used to upsell the user to Premium.
	 *
	 * @param {string} location Where this component is rendered (metabox or sidebar).
	 *
	 * @returns {Array} The upsell results.
	 */
	getUpsellResults( location ) {
		let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.word_complexity" ];
		if ( location === "sidebar" ) {
			link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.word_complexity" ];
		}

		/*
		 * We don't show the upsell in WooCommerce product pages when Yoast SEO WooCommerce plugin is activated.
		 * This is because the premium assessments of the upsell are already loaded even when the Premium plugin is not activated.
		 * Additionally, we also don't show the upsell for Word complexity assessment if it's not supported for the current locale.
		*/
		const contentType = wpseoAdminL10n.postType;
		if ( ( this.props.isYoastSEOWooActive && contentType === "product" ) || ! isWordComplexitySupported() ) {
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
			`<a href="${ link }">`,
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

	/**
	 * Returns a note letting the user know that the Flesch reading ease score has moved to
	 * the insights section.
	 *
	 * @param {string} location The location of the readability analysis (e.g. "metabox" or "sidebar" ).
	 *
	 * @returns {JSX.Element} The Flesch reading ease note.
	 */
	renderFleschReadingEaseNote( location ) {
		const icon = `<svg
			style="vertical-align: middle; margin-left: 2px"
			width="14px"
			height="14px"
			aria-hidden="true"
			role="img"
			focusable="false"
			class="yoast-svg-icon yoast-svg-icon-pencil-square"
			viewBox="0 0 1792 1792"
			fill="currentColor">
				<path d="${ icons[ "pencil-square" ].path }"></path>
		</svg>`;

		const linkToYoastCom = location === "sidebar"
			? wpseoAdminL10n[ "shortlinks-insights-flesch_reading_ease_sidebar" ]
			: wpseoAdminL10n[ "shortlinks-insights-flesch_reading_ease_metabox" ];

		let text = "";
		if ( this.props.isInsightsEnabled ) {
			const onClick = `
			const location = "${ location }";
			const isElementor = ${ this.props.isElementorEditor };
			
			if ( isElementor ) {
				document.getElementById( "yoast-insights-modal-elementor-open-button" ).click();
			} else {
				const metaTab = document.getElementById( "wpseo-meta-tab-content" );
				if ( metaTab && location === "metabox" ) {
					metaTab.click();
					setTimeout( () => {
						const collapsible = document.getElementById( "yoast-insights-collapsible-metabox" );
						if( collapsible.getAttribute( "aria-expanded" ) === "false" ) {
							collapsible.click();
						}
						document.getElementById( "yoastseo-flesch-reading-ease-insights" ).scrollIntoView();
					}, 300 );
				} else if ( location === "sidebar" ) {
					document.getElementById( "yoast-insights-modal-sidebar-open-button" ).click();
				}
			}
			`.replaceAll( /(\n|\s)+/g, " " );

			text = sprintf(
				/* Translators:
					%1$s is an anchor opening tag with a link leading to an article on yoast.com;
					%2$s is an anchor closing tag;
					%3$s is an anchor opening tag with a link to our insights section;
					%4$s is an icon. */
				__( "Curious to see the %1$sFlesch reading ease%2$s score of your text? We've moved the score to our %3$sInsights%4$s%2$s section.", "wordpress-seo" ),
				`<a href='${ linkToYoastCom }' target='_blank'>`,
				"</a>",
				`<a href='#' onclick='${ onClick }'>`,
				icon
			);
		} else {
			text = sprintf(
				/* Translators:
					%1$s is an anchor opening tag with a link leading to an article on yoast.com;
					%2$s is an anchor closing tag; */
				__( "Curious to see the %1$sFlesch reading ease%2$s score of your text? " +
					"We've moved the score to our Insights section. " +
					"Enable the Insights feature in General > Features, or ask your admin to enable it for you.", "wordpress-seo" ),
				`<a href='${ linkToYoastCom }' target='_blank'>`,
				"</a>"
			);
		}

		return <ul>
			<AnalysisResult
				icon="alert-info"
				pressed={ false }
				onButtonClickMarks={ noop }
				bulletColor="gray"
				buttonIdMarks={ "" }
				text={ text }
				hasMarksButton={ false }
				ariaLabelMarks={ "" }
			/>
		</ul>;
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
					let upsellResults = [];
					if ( this.props.shouldUpsell ) {
						upsellResults = this.getUpsellResults( location );
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
								{ this.props.isFleschReadingEaseAvailable && this.renderFleschReadingEaseNote( location ) }
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
									{ this.props.isFleschReadingEaseAvailable && this.renderFleschReadingEaseNote( location ) }
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
	shouldUpsell: PropTypes.bool,
	isYoastSEOWooActive: PropTypes.bool,
	isInsightsEnabled: PropTypes.bool,
	isElementorEditor: PropTypes.bool,
	isFleschReadingEaseAvailable: PropTypes.bool,
};

ReadabilityAnalysis.defaultProps = {
	overallScore: null,
	shouldUpsell: false,
	isYoastSEOWooActive: false,
	isInsightsEnabled: false,
	isElementorEditor: false,
	isFleschReadingEaseAvailable: false,
};

export default withSelect( select => {
	const {
		getReadabilityResults,
		getMarkButtonStatus,
		getPreference,
		getIsElementorEditor,
		isFleschReadingEaseAvailable,
	} = select( "yoast-seo/editor" );

	const isInsightsEnabled = getPreference( "isInsightsEnabled", false );

	return {
		...getReadabilityResults(),
		marksButtonStatus: getMarkButtonStatus(),
		isInsightsEnabled,
		isElementorEditor: getIsElementorEditor(),
		isFleschReadingEaseAvailable: isFleschReadingEaseAvailable(),
	};
} )( ReadabilityAnalysis );
