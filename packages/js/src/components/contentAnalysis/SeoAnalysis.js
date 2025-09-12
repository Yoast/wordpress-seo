import { withSelect } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationConsumer, RootContext } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import styled from "styled-components";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import Results from "../../containers/Results";
import MetaboxCollapsible from "../MetaboxCollapsible";
import ScoreIconPortal from "../portals/ScoreIconPortal";
import SidebarCollapsible from "../SidebarCollapsible";
import SynonymSlot from "../slots/SynonymSlot";
import { getIconForScore } from "./mapResults";
import AIOptimizeButton from "../../ai-optimizer/components/ai-optimize-button";
import { shouldRenderAIOptimizeButton } from "../../helpers/shouldRenderAIOptimizeButton";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 1.5em 0 1em;
	display: block;
`;

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysis extends Component {
	/**
	 * Renders the ScoreIconPortal component, which displays a score indication icon in the SEO metabox tab.
	 *
	 * @param {string} location       Where this component is rendered.
	 * @param {string} scoreIndicator String indicating the score.
	 *
	 * @returns {JSX.Element} The rendered score icon portal element.
	 */
	renderTabIcon( location, scoreIndicator ) {
		// The tab icon should only be rendered for the metabox.
		if ( location !== "metabox" ) {
			return null;
		}

		return (
			<ScoreIconPortal
				target="wpseo-seo-score-icon"
				scoreIndicator={ scoreIndicator }
			/>
		);
	}

	/**
	 * Renders the Yoast AI Optimize button.
	 * The button is shown when:
	 * - The assessment can be fixed through Yoast AI Optimize.
	 * - The AI feature is enabled (for Yoast SEO Premium users; for Free users, the button is shown with an upsell).
	 * - We are in the block editor or classic editor.
	 * - We are not in the Elementor editor, nor in the Elementor in-between screen.
	 * - We are not in a Taxonomy.
	 *
	 * @param {boolean} hasAIFixes Whether the assessment can be fixed through Yoast AI Optimize.
	 * @param {string} id The assessment ID.
	 *
	 * @returns {void|JSX.Element} The AI Optimize button, or nothing if the button should not be shown.
	 */
	renderAIOptimizeButton = ( hasAIFixes, id ) => {
		const { isElementor, isAiFeatureEnabled, isPremium, isTerm } = this.props;

		// Don't show the button if the AI feature is not enabled for Yoast SEO Premium users.
		if ( isPremium && ! isAiFeatureEnabled ) {
			return;
		}

		const shouldRenderAIButton = shouldRenderAIOptimizeButton( hasAIFixes, isElementor, isTerm );
		// Show the button if the assessment can be fixed through Yoast AI Optimize, and we are not in the Elementor editor, or Taxonomy.
		return shouldRenderAIButton && ( <AIOptimizeButton id={ id } isPremium={ isPremium } /> );
	};


	/**
	 * Renders the SEO Analysis component.
	 *
	 * @returns {JSX.Element} The SEO Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );
		const { isPremium } = this.props;
		const highlightingUpsellLink = "shortlinks.upsell.sidebar.highlighting_seo_analysis";

		if ( score.className !== "loading" && this.props.keyword === "" ) {
			score.className = "na";
			score.screenReaderReadabilityText = __( "Enter a focus keyphrase to calculate the SEO score", "wordpress-seo" );
		}

		return (
			<LocationConsumer>
				{ location => {
					return (
						<RootContext.Consumer>
							{ () => {
								const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

								return (
									<Fragment>
										<Collapsible
											title={ isPremium
												? __( "Premium SEO analysis", "wordpress-seo" )
												: __( "SEO analysis", "wordpress-seo" ) }
											titleScreenReaderText={ score.screenReaderReadabilityText }
											prefixIcon={ getIconForScore( score.className ) }
											prefixIconCollapsed={ getIconForScore( score.className ) }
											subTitle={ this.props.keyword }
											id={ `yoast-seo-analysis-collapsible-${ location }` }
										>
											<SynonymSlot location={ location } />

											<AnalysisHeader>
												{ __( "Analysis results", "wordpress-seo" ) }
											</AnalysisHeader>
											<Results
												results={ this.props.results }
												marksButtonClassName="yoast-tooltip yoast-tooltip-w"
												editButtonClassName="yoast-tooltip yoast-tooltip-w"
												marksButtonStatus={ this.props.marksButtonStatus }
												location={ location }
												shouldUpsellHighlighting={ this.props.shouldUpsellHighlighting }
												highlightingUpsellLink={ highlightingUpsellLink }
												renderAIOptimizeButton={ this.renderAIOptimizeButton }
											/>
										</Collapsible>
										{ this.renderTabIcon( location, score.className ) }
									</Fragment>
								);
							} }
						</RootContext.Consumer>
					);
				} }
			</LocationConsumer>
		);
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	keyword: PropTypes.string,
	shouldUpsell: PropTypes.bool,
	overallScore: PropTypes.number,
	shouldUpsellHighlighting: PropTypes.bool,
	isElementor: PropTypes.bool,
	isAiFeatureEnabled: PropTypes.bool,
	isPremium: PropTypes.bool,
	isTerm: PropTypes.bool,
};

SeoAnalysis.defaultProps = {
	results: [],
	marksButtonStatus: null,
	keyword: "",
	shouldUpsell: false,
	overallScore: null,
	shouldUpsellHighlighting: false,
	isElementor: false,
	isAiFeatureEnabled: false,
	isPremium: false,
	isTerm: false,
};

export default withSelect( ( select, ownProps ) => {
	const {
		getFocusKeyphrase,
		getMarksButtonStatus,
		getResultsForKeyword,
		getIsElementorEditor,
		getIsPremium,
		getIsAiFeatureEnabled,
		getIsTerm,
	} = select( "yoast-seo/editor" );

	const keyword = getFocusKeyphrase();

	return {
		...getResultsForKeyword( keyword ),
		marksButtonStatus: ownProps.hideMarksButtons ? "disabled" : getMarksButtonStatus(),
		keyword,
		isElementor: getIsElementorEditor(),
		isPremium: getIsPremium(),
		isAiFeatureEnabled: getIsAiFeatureEnabled(),
		isTerm: getIsTerm(),
	};
} )( SeoAnalysis );
