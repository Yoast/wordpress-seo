/* global wpseoAdminL10n */
import { withSelect } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { YoastSeoIcon } from "@yoast/components";
import PropTypes from "prop-types";
import styled from "styled-components";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import Results from "../../containers/Results";
import AnalysisUpsell from "../AnalysisUpsell";
import { LocationConsumer } from "@yoast/externals/contexts";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { ModalContainer, ModalIcon } from "../modals/Container";
import KeywordSynonyms from "../modals/KeywordSynonyms";
import MultipleKeywords from "../modals/MultipleKeywords";
import Modal from "../modals/SeoAnalysisModal";
import ScoreIconPortal from "../portals/ScoreIconPortal";
import SidebarCollapsible from "../SidebarCollapsible";
import SynonymSlot from "../slots/SynonymSlot";
import { getIconForScore } from "./mapResults";

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
	 *
	 * @returns {wp.Element} A modalButtonContainer component with the modal for a keyword synonyms upsell.
	 */
	renderSynonymsUpsell( location ) {
		const modalProps = {
			classes: {
				openButton: "wpseo-keyword-synonyms button-link",
			},
			labels: {
				open: "+ " + __( "Add synonyms", "wordpress-seo" ),
				modalAriaLabel: sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				),
				heading: sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				),
			},
		};

		// Defaults to metabox.
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_button" ];

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_synonyms_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_synonyms_button" ];
		}

		return (
			<Modal { ...modalProps }>
				<ModalContainer>
					<ModalIcon icon={ YoastSeoIcon } />
					<h2>{ __( "Would you like to add keyphrase synonyms?", "wordpress-seo" ) }</h2>

					<KeywordSynonyms link={ link } buyLink={ buyLink } />
				</ModalContainer>
			</Modal>
		);
	}

	/**
	 * Renders the multiple keywords upsell modal.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 *
	 * @returns {wp.Element} A modalButtonContainer component with the modal for a multiple keywords upsell.
	 */
	renderMultipleKeywordsUpsell( location ) {
		const modalProps = {
			classes: {
				openButton: "wpseo-multiple-keywords button-link",
			},
			labels: {
				open: "+ " + __( "Add related keyphrase", "wordpress-seo" ),
				modalAriaLabel: sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				),
				heading: sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				),
			},
		};

		// Defaults to metabox
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_button" ];

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_additional_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_additional_button" ];
		}

		return (
			<Modal { ...modalProps }>
				<ModalContainer>
					<ModalIcon icon={ YoastSeoIcon } />
					<h2>{ __( "Would you like to add a related keyphrase?", "wordpress-seo" ) }</h2>
					<MultipleKeywords
						link={ link }
						buyLink={ buyLink }
					/>
				</ModalContainer>
			</Modal>
		);
	}

	/**
	 * Renders the AnalysisUpsell component.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlink in the component.
	 *
	 * @returns {wp.Element} The AnalysisUpsell component.
	 */
	renderWordFormsUpsell( location ) {
		return (
			<AnalysisUpsell
				url={ location === "sidebar"
					? wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_sidebar" ]
					: wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_metabox" ] }
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
	 * @returns {wp.Element} The rendered score icone portal element.
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
	 * @param {string} location Where this component is rendered (metabox or sidebar).
	 *
	 * @returns {Array} The upsell results.
	 */
	getUpsellResults( location ) {
		let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.keyphrase_distribution" ];
		if ( location === "sidebar" ) {
			link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.keyphrase_distribution" ];
		}

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
			`<a href="${ link }">`,
			"</a>"
		);

		return [
			{
				score: 0,
				rating: "upsell",
				hasMarks: false,
				id: "keyphraseDistribution",
				text: keyphraseDistributionUpsellText,
				markerId: "keyphraseDistribution",
			},
		];
	}

	/**
	 * Renders the SEO Analysis component.
	 *
	 * @returns {wp.Element} The SEO Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );

		if ( score.className !== "loading" && this.props.keyword === "" ) {
			score.className = "na";
			score.screenReaderReadabilityText = __( "Enter a focus keyphrase to calculate the SEO score", "wordpress-seo" );
		}

		return (
			<LocationConsumer>
				{ location => {
					const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

					let upsellResults = [];
					if ( this.props.shouldUpsell ) {
						upsellResults = this.getUpsellResults( location );
					}

					return (
						<Fragment>
							<Collapsible
								title={ __( "SEO analysis", "wordpress-seo" ) }
								titleScreenReaderText={ score.screenReaderReadabilityText }
								prefixIcon={ getIconForScore( score.className ) }
								prefixIconCollapsed={ getIconForScore( score.className ) }
								subTitle={ this.props.keyword }
								id={ `yoast-seo-analysis-collapsible-${ location }` }
							>
								<SynonymSlot location={ location } />
								{ this.props.shouldUpsell && <Fragment>
									{ this.renderSynonymsUpsell( location ) }
									{ this.renderMultipleKeywordsUpsell( location ) }
								</Fragment> }
								{ this.props.shouldUpsellWordFormRecognition && this.renderWordFormsUpsell( location ) }
								<AnalysisHeader>
									{ __( "Analysis results", "wordpress-seo" ) }
								</AnalysisHeader>
								<Results
									results={ this.props.results }
									upsellResults={ upsellResults }
									marksButtonClassName="yoast-tooltip yoast-tooltip-w"
									marksButtonStatus={ this.props.marksButtonStatus }
								/>
							</Collapsible>
							{ this.renderTabIcon( location, score.className ) }
						</Fragment>
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
};

SeoAnalysis.defaultProps = {
	results: [],
	marksButtonStatus: null,
	keyword: "",
	shouldUpsell: false,
	shouldUpsellWordFormRecognition: false,
	overallScore: null,
};

export default withSelect( ( select, ownProps ) => {
	const {
		getFocusKeyphrase,
		getMarksButtonStatus,
		getResultsForKeyword,
	} = select( "yoast-seo/editor" );

	const keyword = getFocusKeyphrase();

	return {
		...getResultsForKeyword( keyword ),
		marksButtonStatus: ownProps.hideMarksButtons ? "disabled" : getMarksButtonStatus(),
		keyword,
	};
} )( SeoAnalysis );
