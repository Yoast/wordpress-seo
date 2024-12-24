/* global wpseoAdminL10n */
import { withSelect } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { LocationConsumer, RootContext } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import styled from "styled-components";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import Results from "../../containers/Results";
import AnalysisUpsell from "../AnalysisUpsell";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { ModalSmallContainer } from "../modals/Container";
import KeywordSynonyms from "../modals/KeywordSynonyms";
import { defaultModalClassName } from "../modals/Modal";
import MultipleKeywords from "../modals/MultipleKeywords";
import Modal from "../modals/SeoAnalysisModal";
import ScoreIconPortal from "../portals/ScoreIconPortal";
import SidebarCollapsible from "../SidebarCollapsible";
import SynonymSlot from "../slots/SynonymSlot";
import { getIconForScore } from "./mapResults";
import isBlockEditor from "../../helpers/isBlockEditor";
import AIAssessmentFixesButton from "../../ai-assessment-fixes/components/ai-assessment-fixes-button";

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
	 * Renders the keyword synonyms upsell modal.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 * @param {string} locationContext In which editor this component is rendered.
	 *
	 * @returns {JSX.Element} A modalButtonContainer component with the modal for a keyword synonyms upsell.
	 */
	renderSynonymsUpsell( location, locationContext ) {
		const modalProps = {
			className: `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding`,
			classes: {
				openButton: "wpseo-keyword-synonyms button-link",
			},
			labels: {
				open: "+ " + __( "Add synonyms", "wordpress-seo" ),
				modalAriaLabel: __( "Add synonyms", "wordpress-seo" ),
				heading: __( "Add synonyms", "wordpress-seo" ),
			},
		};

		const buyLink = wpseoAdminL10n[
			location.toLowerCase() === "sidebar"
				? "shortlinks.upsell.sidebar.focus_keyword_synonyms_button"
				: "shortlinks.upsell.metabox.focus_keyword_synonyms_button"
		];

		return (
			<Modal { ...modalProps }>
				<ModalSmallContainer>
					<KeywordSynonyms buyLink={ addQueryArgs( buyLink, { context: locationContext } ) } />
				</ModalSmallContainer>
			</Modal>
		);
	}

	/**
	 * Renders the multiple keywords upsell modal.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 * @param {string} locationContext In which editor this component is rendered.
	 *
	 * @returns {JSX.Element} A modalButtonContainer component with the modal for a multiple keywords upsell.
	 */
	renderMultipleKeywordsUpsell( location, locationContext ) {
		const modalProps = {
			className: `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding`,
			classes: {
				openButton: "wpseo-multiple-keywords button-link",
			},
			labels: {
				open: "+ " + __( "Add related keyphrase", "wordpress-seo" ),
				modalAriaLabel: __( "Add related keyphrases", "wordpress-seo" ),
				heading: __( "Add related keyphrases", "wordpress-seo" ),
			},
		};

		const buyLink = wpseoAdminL10n[
			location.toLowerCase() === "sidebar"
				? "shortlinks.upsell.sidebar.focus_keyword_additional_button"
				: "shortlinks.upsell.metabox.focus_keyword_additional_button"
		];

		return (
			<Modal { ...modalProps }>
				<ModalSmallContainer>
					<MultipleKeywords buyLink={ addQueryArgs( buyLink, { context: locationContext } ) } />
				</ModalSmallContainer>
			</Modal>
		);
	}

	/**
	 * Renders the AnalysisUpsell component.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlink in the component.
	 * @param {string} locationContext In which editor this component is rendered.
	 *
	 * @returns {JSX.Element} The AnalysisUpsell component.
	 */
	renderWordFormsUpsell( location, locationContext ) {
		let url = location === "sidebar"
			? wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_sidebar" ]
			: wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_metabox" ];
		url = addQueryArgs( url, { context: locationContext } );
		return (
			<AnalysisUpsell
				url={ url }
				alignment={ location === "sidebar" ? "vertical" : "horizontal" }
			/>
		);
	}

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
	 * Returns the list of results used to upsell the user to Premium.
	 *
	 * @param {string} location 		Where this component is rendered (metabox or sidebar).
	 * @param {string} locationContext 	In which editor this component is rendered.
	 *
	 * @returns {Array} The upsell results.
	 */
	getUpsellResults( location, locationContext ) {
		let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.keyphrase_distribution" ];
		if ( location === "sidebar" ) {
			link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.keyphrase_distribution" ];
		}
		link = addQueryArgs( link, { context: locationContext } );

		const keyphraseDistributionUpsellText = sprintf(
			/* Translators: %1$s is a span tag that adds styling to 'Keyphrase distribution', %2$s is a closing span tag.
			 %3%s is an anchor tag with a link to yoast.com, %4$s is a closing anchor tag.*/
			__(
				"%1$sKeyphrase distribution%2$s: Have you evenly distributed your focus keyphrase throughout the whole text? " +
				"%3$sYoast SEO Premium will tell you!%4$s",
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
				hasJumps: false,
				id: "keyphraseDistribution",
				text: keyphraseDistributionUpsellText,
				markerId: "keyphraseDistribution",
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
		const { isElementor, isAiFeatureEnabled, isPremium } = this.props;

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
							{ ( { locationContext } ) => {
								const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

								let upsellResults = [];
								if ( this.props.shouldUpsell ) {
									upsellResults = this.getUpsellResults( location, locationContext );
								}

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
											{ this.props.shouldUpsell && <Fragment>
												{ this.renderSynonymsUpsell( location, locationContext ) }
												{ this.renderMultipleKeywordsUpsell( location, locationContext ) }
											</Fragment> }
											{ this.props.shouldUpsellWordFormRecognition && this.renderWordFormsUpsell( location, locationContext ) }
											<AnalysisHeader>
												{ __( "Analysis results", "wordpress-seo" ) }
											</AnalysisHeader>
											<Results
												results={ this.props.results }
												upsellResults={ upsellResults }
												marksButtonClassName="yoast-tooltip yoast-tooltip-w"
												editButtonClassName="yoast-tooltip yoast-tooltip-w"
												marksButtonStatus={ this.props.marksButtonStatus }
												location={ location }
												shouldUpsellHighlighting={ this.props.shouldUpsellHighlighting }
												highlightingUpsellLink={ highlightingUpsellLink }
												renderAIFixesButton={ this.renderAIFixesButton }
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
	shouldUpsellWordFormRecognition: PropTypes.bool,
	overallScore: PropTypes.number,
	shouldUpsellHighlighting: PropTypes.bool,
	isElementor: PropTypes.bool,
	isAiFeatureEnabled: PropTypes.bool,
	isPremium: PropTypes.bool,
};

SeoAnalysis.defaultProps = {
	results: [],
	marksButtonStatus: null,
	keyword: "",
	shouldUpsell: false,
	shouldUpsellWordFormRecognition: false,
	overallScore: null,
	shouldUpsellHighlighting: false,
	isElementor: false,
	isAiFeatureEnabled: false,
	isPremium: false,
};

export default withSelect( ( select, ownProps ) => {
	const {
		getFocusKeyphrase,
		getMarksButtonStatus,
		getResultsForKeyword,
		getIsElementorEditor,
		getIsPremium,
		getIsAiFeatureEnabled,
	} = select( "yoast-seo/editor" );

	const keyword = getFocusKeyphrase();

	return {
		...getResultsForKeyword( keyword ),
		marksButtonStatus: ownProps.hideMarksButtons ? "disabled" : getMarksButtonStatus(),
		keyword,
		isElementor: getIsElementorEditor(),
		isPremium: getIsPremium(),
		isAiFeatureEnabled: getIsAiFeatureEnabled(),
	};
} )( SeoAnalysis );
