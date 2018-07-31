/* globals yoastModalConfig */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import colors from "yoast-components/style-guide/colors.json";
import Collapsible from "yoast-components/composites/Plugin/Shared/components/Collapsible";
import KeywordInput from "yoast-components/composites/Plugin/Shared/components/KeywordInput";

import Results from "./Results";
import UpsellBox from "../UpsellBox";
import { setFocusKeyword } from "../../redux/actions/focusKeyword";
import ModalButtonContainer from "../ModalButtonContainer";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 1.5em 0 1em;
	display: block;
`;

const ExplanationText = styled.p`
`;

/**
 * Redux container for the seo analysis.
 */
class SeoAnalysis extends React.Component {
	renderSynonymsUpsell() {
		let config = yoastModalConfig;
		let synonymsConfig = config.filter( ( modalConfig ) => {
			return modalConfig.content === "KeywordSynonyms";
		} );

		return(
			<ModalButtonContainer { ...synonymsConfig[ synonymsConfig.length - 1 ] } />
		);
	}


	/**
	 * Renders the UpsellBox component.
	 *
	 * @param {Object} upsell The upsell object containing the properties.
	 *
	 * @returns {ReactElement} The UpsellBox component.
	 */
	renderKeywordUpsell() {
		const upsell = this.props.keywordUpsell;
		return (
			<Collapsible
			prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey_disabled } }
			prefixIconCollapsed={ { icon: "seo-score-none", color: colors.$color_grey_disabled } }
			title="Add another keyword"
			>
				<UpsellBox
					benefits={ upsell.benefits }
					infoParagraphs={ upsell.infoParagraphs }
					upsellButtonText={ upsell.buttonText }
					upsellButton={ {
						href: upsell.buttonLink,
						className: "button button-primary",
						"aria-labelledby": "label-id",
					} }
					upsellButtonLabel={ upsell.buttonLabel }
				/>
			</Collapsible>
		);
	}

	/**
	 * Renders the SEO Analysis component.
	 *
	 * @returns {ReactElement} The SEO Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );

		if( this.props.keyword === "" ) {
			score.className = "na";
			score.screenReaderReadabilityText = __( "Enter a focus keyword to calculate the SEO score", "wordpress-seo" );
		}

		return (
			<React.Fragment>
				<Collapsible
					title="Focus keyword analysis"
					titleScreenReaderText={ score.screenReaderReadabilityText }
					prefixIcon={ getIconForScore( score.className ) }
					prefixIconCollapsed={ getIconForScore( score.className ) }
					subTitle={ this.props.keyword }
				>
					<ExplanationText>
						A focus keyword is the term (or phrase) you'd like to be found with in search engines.
						Enter it below to see how you can improve your text for this term. <a href="#">Learn more about the Keyword Analysis</a>
					</ExplanationText>
					<KeywordInput
						id="focus-keyword-input"
						onChange={ this.props.onFocusKeywordChange }
						keyword={ this.props.keyword }
					/>
					<Slot name="YoastSynonyms" />
					{ this.props.shouldUpsell && this.renderSynonymsUpsell() }
					<AnalysisHeader>
						Analysis results:
					</AnalysisHeader>
					<Results
						showLanguageNotice={ false }
						results={ this.props.results }
						marksButtonClassName="yoast-tooltip yoast-tooltip-s"
						marksButtonStatus={ this.props.marksButtonStatus }
					/>
				</Collapsible>
				{ this.props.shouldUpsell && this.renderKeywordUpsell() }
			</React.Fragment>
		);
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.string,
	hideMarksButtons: PropTypes.bool,
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func,
	keywordUpsell: PropTypes.shape( {
		benefits: PropTypes.array,
		infoParagraphs: PropTypes.array,
		buttonLink: PropTypes.string,
		buttonText: PropTypes.string,
		buttonLabel: PropTypes.string,
	} ),
	shouldUpsell:	PropTypes.bool,
	overallScore: PropTypes.number,
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

	let keyword = state.focusKeyword;

	let results = null;
	let overallScore = null;
	if( state.analysis.seo[ keyword ] ) {
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
		onFocusKeywordChange: ( value ) => {
			dispatch( setFocusKeyword( value ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SeoAnalysis );
