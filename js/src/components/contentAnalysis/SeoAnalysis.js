/* global wpseoAdminL10n */
/* External dependencies */
import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { YoastSeoIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import SidebarCollapsible from "../SidebarCollapsible";
import MetaboxCollapsible from "../MetaboxCollapsible";
import Results from "./Results";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import KeywordSynonyms from "../modals/KeywordSynonyms";
import MultipleKeywords from "../modals/MultipleKeywords";
import { LocationConsumer } from "../contexts/location";
import AnalysisUpsell from "../AnalysisUpsell";
import { ModalContainer, ModalIcon } from "../modals/Container";
import YoastIcon from "../../../../images/Yoast_icon_kader.svg";
import SynonymSlot from "../slots/SynonymSlot";

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
	 * Constructs the SeoAnalysis component.
	 *
	 * @param {Object} props The component properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isKeyphrasesModalOpen: false,
			isSynonymsModalOpen: false,
		};

		this.openKeyphrasesModal  = this.openKeyphrasesModal.bind( this );
		this.closeKeyphrasesModal = this.closeKeyphrasesModal.bind( this );
		this.openSynonymsModal    = this.openSynonymsModal.bind( this );
		this.closeSynonymsModal   = this.closeSynonymsModal.bind( this );
	}

	/**
	 * Opens the Keyphrases modal.
	 *
	 * @returns {void}
	 */
	openKeyphrasesModal() {
		this.setState( { isKeyphrasesModalOpen: true } );
	}

	/**
	 * Closes the Keyphrases modal.
	 *
	 * @returns {void}
	 */
	closeKeyphrasesModal() {
		this.setState( { isKeyphrasesModalOpen: false } );
	}

	/**
	 * Opens the Synonyms modal.
	 *
	 * @returns {void}
	 */
	openSynonymsModal() {
		this.setState( { isSynonymsModalOpen: true } );
	}

	/**
	 * Closes the Synonyms modal.
	 *
	 * @returns {void}
	 */
	closeSynonymsModal() {
		this.setState( { isSynonymsModalOpen: false } );
	}

	/**
	 * Renders the keyword synonyms upsell modal.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 *
	 * @returns {wp.Element} A modalButtonContainer component with the modal for a keyword synonyms upsell.
	 */
	renderSynonymsUpsell( location ) {
		// Defaults to metabox.
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_synonyms_button" ];

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_synonyms_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_synonyms_button" ];
		}

		return (
			<Fragment>
				<button
					type="button"
					onClick={ this.openSynonymsModal }
					className="wpseo-keyword-synonyms button-link"
				>
					{ "+ " + __( "Add synonyms", "wordpress-seo" ) }
				</button>
				{ this.state.isSynonymsModalOpen &&
					<Modal
						title={
							sprintf(
								/* translators: %s expands to 'Yoast SEO Premium'. */
								__( "Get %s", "wordpress-seo" ),
								"Yoast SEO Premium"
							)
						}
						onRequestClose={ this.closeSynonymsModal }
						className="yoast-gutenberg-modal"
						icon={ <YoastIcon /> }
					>
						<ModalContainer>
							<ModalIcon icon={ YoastSeoIcon } />
							<h2>{ __( "Would you like to add keyphrase synonyms?", "wordpress-seo" ) }</h2>
							<KeywordSynonyms
								link={ link }
								buyLink={ buyLink }
							/>
						</ModalContainer>
					</Modal>
				}
			</Fragment>
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
		// Defaults to metabox
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.focus_keyword_additional_button" ];

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_additional_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.focus_keyword_additional_button" ];
		}

		return (
			<Fragment>
				<button
					type="button"
					onClick={ this.openKeyphrasesModal }
					className="wpseo-multiple-keywords button-link"
				>
					{ "+ " + __( "Add related keyphrase", "wordpress-seo" ) }
				</button>
				{ this.state.isKeyphrasesModalOpen &&
					<Modal
						title={
							sprintf(
								/* translators: %s expands to 'Yoast SEO Premium'. */
								__( "Get %s", "wordpress-seo" ),
								"Yoast SEO Premium"
							)
						}
						onRequestClose={ this.closeKeyphrasesModal }
						className="yoast-gutenberg-modal"
						icon={ <YoastIcon /> }
					>
						<ModalContainer>
							<ModalIcon icon={ YoastSeoIcon } />
							<h2>{ __( "Would you like to add a related keyphrase?", "wordpress-seo" ) }</h2>
							<MultipleKeywords
								link={ link }
								buyLink={ buyLink }
							/>
						</ModalContainer>
					</Modal>
				}
			</Fragment>
		);
	}

	/**
	 * Renders the UpsellBox component.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 *
	 * @returns {wp.Element} The UpsellBox component.
	 */
	renderKeywordUpsell( location ) {
		// Default to metabox.
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_button" ];
		let Collapsible = MetaboxCollapsible;

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_button" ];
			Collapsible = SidebarCollapsible;
		}

		return (
			<Collapsible
				prefixIcon={ { icon: "plus", color: colors.$color_grey_medium_dark } }
				prefixIconCollapsed={ { icon: "plus", color: colors.$color_grey_medium_dark } }
				title={ __( "Add related keyphrase", "wordpress-seo" ) }
				id={ `yoast-additional-keyphrase-collapsible-${ location }` }
			>
				<MultipleKeywords
					link={ link }
					buyLink={ buyLink }
				/>
			</Collapsible>
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
									showLanguageNotice={ false }
									results={ this.props.results }
									marksButtonClassName="yoast-tooltip yoast-tooltip-w"
									marksButtonStatus={ this.props.marksButtonStatus }
								/>
							</Collapsible>
							{ this.props.shouldUpsell && this.renderKeywordUpsell( location ) }
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

/**
 * Maps redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state, ownProps ) {
	const marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	const keyword = state.focusKeyword;

	let results = [];
	let overallScore = null;
	if ( state.analysis.seo[ keyword ] ) {
		results = state.analysis.seo[ keyword ].results;
		overallScore = state.analysis.seo[ keyword ].overallScore;
	}
	return {
		results,
		marksButtonStatus,
		keyword,
		overallScore,
	};
}

export default connect( mapStateToProps )( SeoAnalysis );
