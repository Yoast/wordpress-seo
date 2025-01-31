/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import noop from "lodash/noop";

/* Yoast dependencies. */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import AnalysisResult from "./AnalysisResult";

/**
 * Renders a styled list of analyses.
 *
 * @returns {JSX.Element} The rendered tree.
 */
const AnalysisListBase = styled.ul`
	margin: 8px 0;
	padding: 0;
	list-style: none;
`;

/**
 * Converts a result rating to a color.
 *
 * @param {string} rating The rating to convert.
 *
 * @returns {string} The color for the rating.
 */
export function renderRatingToColor( rating ) {
	switch ( rating ) {
		case "good":
			return colors.$color_good;
		case "OK":
			return colors.$color_ok;
		case "bad":
			return colors.$color_bad;
		default:
			return colors.$color_score_icon;
	}
}

/**
 * Renders a list of results based on the array of results.
 *
 * @param {Object}          props                               Component props.
 * @param {MappedResult[]}  props.results                       The results from YoastSEO.js
 * @param {string}          props.marksButtonActivatedResult    The currently activated result.
 * @param {string}          props.marksButtonStatus             The overall status of the mark buttons.
 * @param {string}          props.marksButtonClassName          A class name to set on the mark buttons.
 * @param {string}          props.editButtonClassName           A class name to set on the edit buttons.
 * @param {Function}        [props.markButtonFactory]           Injectable factory to create custom mark buttons.
 * @param {Function}        props.onMarksButtonClick            Function that is called when the user
 *                                                              clicks one of the mark buttons.
 * @param {Function}        props.onEditButtonClick             Function that is called when the user
 *                                                              clicks one of the edit buttons.
 * @param {bool}            props.isPremium                     Whether the Premium plugin is active or not.
 *
 * @returns {JSX.Element} The rendered list.
 */
export default function AnalysisList( props ) {
	return <AnalysisListBase role="list">
		{ props.results.map( ( result ) => {
			const color = renderRatingToColor( result.rating );
			const isMarkButtonPressed = result.markerId === props.marksButtonActivatedResult;

			const markButtonId = result.id + "Mark";
			const editButtonId = result.id + "Edit";

			let ariaLabelMarks = "";
			if ( props.marksButtonStatus === "disabled" ) {
				ariaLabelMarks = __( "Highlighting is currently disabled", "wordpress-seo" );
			} else if ( isMarkButtonPressed ) {
				ariaLabelMarks = __( "Remove highlight from the text", "wordpress-seo" );
			} else {
				ariaLabelMarks = __( "Highlight this result in the text", "wordpress-seo" );
			}

			const editFieldName = result.editFieldName;
			const ariaLabelEdit = editFieldName === "" ? ""
				: sprintf(
					/* Translators: %1$s refers to the name of the field that should be edited (keyphrase, meta description,
					   slug or SEO title). */
					__( "Edit your %1$s", "wordpress-seo" ), editFieldName );

			return <AnalysisResult
				key={ result.id }
				id={ result.id }
				text={ result.text }
				marker={ result.marker }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				hasEditButton={ result.hasJumps }
				hasAIFixes={ result.hasAIFixes }
				ariaLabelMarks={ ariaLabelMarks }
				ariaLabelEdit={ ariaLabelEdit }
				pressed={ isMarkButtonPressed }
				suppressedText={ result.rating === "upsell" }
				buttonIdMarks={ markButtonId }
				buttonIdEdit={ editButtonId }
				onButtonClickMarks={ () => props.onMarksButtonClick( result.id, result.marker ) }
				onButtonClickEdit={ () => props.onEditButtonClick( result.id ) }
				marksButtonClassName={ props.marksButtonClassName }
				editButtonClassName={ props.editButtonClassName }
				marksButtonStatus={ props.marksButtonStatus }
				hasBetaBadgeLabel={ result.hasBetaBadge }
				isPremium={ props.isPremium }
				onResultChange={ props.onResultChange }
				markButtonFactory={ props.markButtonFactory }
				shouldUpsellHighlighting={ props.shouldUpsellHighlighting }
				renderAIFixesButton={ props.renderAIFixesButton }
				renderHighlightingUpsell={ props.renderHighlightingUpsell }
			/>;
		} ) }
	</AnalysisListBase>;
}

AnalysisList.propTypes = {
	results: PropTypes.array.isRequired,
	marksButtonActivatedResult: PropTypes.string,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	editButtonClassName: PropTypes.string,
	markButtonFactory: PropTypes.func,
	onMarksButtonClick: PropTypes.func,
	onEditButtonClick: PropTypes.func,
	isPremium: PropTypes.bool,
	onResultChange: PropTypes.func,
	shouldUpsellHighlighting: PropTypes.bool,
	renderHighlightingUpsell: PropTypes.func,
	renderAIFixesButton: PropTypes.func,
};

AnalysisList.defaultProps = {
	marksButtonActivatedResult: "",
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	onMarksButtonClick: noop,
	onEditButtonClick: noop,
	isPremium: false,
	onResultChange: noop,
	shouldUpsellHighlighting: false,
	renderHighlightingUpsell: noop,
	renderAIFixesButton: noop,
};
