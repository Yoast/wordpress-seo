/* global wpseoPostScraperL10n wpseoTermScraperL10n wpseoAdminL10n */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Slot } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { KeywordInput, colors } from "yoast-components";
import Collapsible from "../SidebarCollapsible";
import Results from "./Results";
import { setFocusKeyword } from "../../redux/actions/focusKeyword";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import KeywordSynonyms from "../modals/KeywordSynonyms";
import Modal from "../modals/Modal";
import MultipleKeywords from "../modals/MultipleKeywords";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import { LocationConsumer } from "../contexts/location";
import AnalysisUpsell from "../AnalysisUpsell";
import RecalibrationBetaNotification from "./RecalibrationBetaNotification";
import HelpLink from "./HelpLink";
import { setMarkerPauseStatus } from "../../redux/actions/markerPauseStatus";
import { ModalContainer, ModalIcon } from "../modals/Container";

// We need localizedData temporarily here to know if the recalibration beta is toggled.
let localizedData = {};
if ( window.wpseoPostScraperL10n ) {
	localizedData = wpseoPostScraperL10n;
} else if ( window.wpseoTermScraperL10n ) {
	localizedData = wpseoTermScraperL10n;
}

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 1.5em 0 1em;
	display: block;
`;

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysis extends React.Component {
	/**
	 * Renders the keyword synonyms upsell modal.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 *
	 * @returns {ReactElement} A modalButtonContainer component with the modal for a keyword synonyms upsell.
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
	 * @returns {ReactElement} A modalButtonContainer component with the modal for a multiple keywords upsell.
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
	 * Renders the UpsellBox component.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
	 *
	 * @returns {ReactElement} The UpsellBox component.
	 */
	renderKeywordUpsell( location ) {
		// Default to metabox.
		let link    = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_link" ];
		let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_button" ];

		if ( location.toLowerCase() === "sidebar" ) {
			link    = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_link" ];
			buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_button" ];
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
	 * Renders a help link.
	 *
	 * @returns {ReactElement} The help link component.
	 */
	renderHelpLink() {
		return (
			<HelpLink
				href={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] }
				rel={ null }
				className="dashicons"
			>
				<span className="screen-reader-text">
					{ __( "Help on choosing the perfect focus keyphrase", "wordpress-seo" ) }
				</span>
			</HelpLink>
		);
	}

	/**
	 * Renders the AnalysisUpsell component.
	 *
	 * @param {string} location The location of the upsell component. Used to determine the shortlink in the component.
	 *
	 * @returns {ReactElement} The AnalysisUpsell component.
	 */
	renderWordFormsUpsell( location ) {
		return <AnalysisUpsell
			url={ location === "sidebar"
				? wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_sidebar" ]
				: wpseoAdminL10n[ "shortlinks.upsell.sidebar.morphology_upsell_metabox" ] }
			alignment={ location === "sidebar" ? "vertical" : "horizontal" }
		/>;
	}

	/**
	 * Renders the SEO Analysis component.
	 *
	 * @returns {ReactElement} The SEO Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );
		const isRecalibrationBetaActive = localizedData.recalibrationBetaActive;

		let analysisTitle = __( "Focus keyphrase", "wordpress-seo" );

		// Adjust the title when the beta is active.
		if ( isRecalibrationBetaActive ) {
			analysisTitle =  __( "Focus keyphrase (beta)", "wordpress-seo" );
		}

		if ( score.className !== "loading" && this.props.keyword === "" ) {
			score.className = "na";
			score.screenReaderReadabilityText = __( "Enter a focus keyphrase to calculate the SEO score", "wordpress-seo" );
		}

		return (
			<LocationConsumer>
				{ context => (
					<Fragment>
						<Collapsible
							title={ analysisTitle }
							titleScreenReaderText={ score.screenReaderReadabilityText }
							prefixIcon={ getIconForScore( score.className ) }
							prefixIconCollapsed={ getIconForScore( score.className ) }
							subTitle={ this.props.keyword }
							id={ `yoast-seo-analysis-collapsible-${ context }` }
						>
							{ isRecalibrationBetaActive ? <RecalibrationBetaNotification /> : null }
							<KeywordInput
								id="focus-keyword-input"
								onChange={ this.props.onFocusKeywordChange }
								keyword={ this.props.keyword }
								label={ __( "Focus keyphrase", "wordpress-seo" ) }
								helpLink={ this.renderHelpLink() }
								onBlurKeyword={ this.props.onBlurKeyword }
								onFocusKeyword={ this.props.onFocusKeyword }
							/>
							<Slot name="YoastSynonyms" />
							{ this.props.shouldUpsell && <Fragment>
								{ this.renderSynonymsUpsell( context ) }
								{ this.renderMultipleKeywordsUpsell( context ) }
							</Fragment> }
							{ this.props.shouldUpsellWordFormRecognition && this.renderWordFormsUpsell( context ) }
							<AnalysisHeader>
								{ __( "Analysis results", "wordpress-seo" ) }
							</AnalysisHeader>
							<Results
								showLanguageNotice={ false }
								results={ this.props.results }
								marksButtonClassName="yoast-tooltip yoast-tooltip-s"
								marksButtonStatus={ this.props.marksButtonStatus }
							/>
						</Collapsible>
						{ this.props.shouldUpsell && this.renderKeywordUpsell( context ) }
					</Fragment>
				) }
			</LocationConsumer>
		);
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func.isRequired,
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

/**
 * Maps the redux dispatch to KeywordInput props.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `KeywordInput` component.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onFocusKeyword: () => {
			dispatch( setMarkerPauseStatus( true ) );
		},
		onFocusKeywordChange: ( value ) => {
			dispatch( setFocusKeyword( value ) );
		},
		onBlurKeyword: () => {
			dispatch( setMarkerPauseStatus( false ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SeoAnalysis );
