import { __ } from "@wordpress/i18n";
import { colors } from "@yoast/style-guide";
import noop from "lodash/noop";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
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
 * @param {MappedResult[]} results The results from YoastSEO.js.
 * @param {string} [marksButtonActivatedResult] The currently activated result.
 * @param {string} [marksButtonStatus] The overall status of the mark buttons.
 * @param {string} [marksButtonClassName] A class name to set on the mark buttons.
 * @param {string} [editButtonClassName] A class name to set on the edit buttons.
 * @param {?Function} [markButtonFactory] Injectable factory to create custom mark buttons.
 * @param {Function} [onMarksButtonClick] Function that is called when the user clicks one of the mark buttons.
 * @param {Function} [onEditButtonClick] Function that is called when the user clicks one of the edit buttons.
 * @param {boolean} [isPremium] Whether the Premium plugin is active or not.
 * @param {Function} [onResultChange] Function that is called when the user changes the result.
 * @param {boolean} [shouldUpsellHighlighting] Whether the highlighting upsell should be shown.
 * @param {Function} [renderHighlightingUpsell] Function to render the highlighting upsell.
 * @param {Function} [renderAIOptimizeButton] Function to render the AI optimize button.
 *
 * @returns {JSX.Element} The rendered list.
 */
export default function AnalysisList( {
	results,
	marksButtonActivatedResult = "",
	marksButtonStatus = "enabled",
	marksButtonClassName = "",
	editButtonClassName = "",
	markButtonFactory = null,
	onMarksButtonClick = noop,
	onEditButtonClick = noop,
	isPremium = false,
	onResultChange = noop,
	shouldUpsellHighlighting = false,
	renderHighlightingUpsell = noop,
	renderAIOptimizeButton = noop,
} ) {
	return <AnalysisListBase role="list">
		{ results.map( ( result ) => {
			const color = renderRatingToColor( result.rating );
			const isMarkButtonPressed = result.markerId === marksButtonActivatedResult;
			const editFieldName = result.editFieldName;

			const markButtonId = result.id + "Mark";
			const editButtonId = editFieldName + "Edit";

			let ariaLabelMarks = "";
			if ( marksButtonStatus === "disabled" ) {
				ariaLabelMarks = __( "Highlighting is currently disabled", "wordpress-seo" );
			} else if ( isMarkButtonPressed ) {
				ariaLabelMarks = __( "Remove highlight from the text", "wordpress-seo" );
			} else {
				ariaLabelMarks = __( "Highlight this result in the text", "wordpress-seo" );
			}

			const ariaLabelEdit = result.editFieldAriaLabel;

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
				onButtonClickMarks={ () => onMarksButtonClick( result.id, result.marker ) }
				onButtonClickEdit={ ( event ) => onEditButtonClick( editFieldName, event ) }
				marksButtonClassName={ marksButtonClassName }
				editButtonClassName={ editButtonClassName }
				marksButtonStatus={ marksButtonStatus }
				hasBetaBadgeLabel={ result.hasBetaBadge }
				isPremium={ isPremium }
				onResultChange={ onResultChange }
				markButtonFactory={ markButtonFactory }
				shouldUpsellHighlighting={ shouldUpsellHighlighting }
				renderAIOptimizeButton={ renderAIOptimizeButton }
				renderHighlightingUpsell={ renderHighlightingUpsell }
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
	renderAIOptimizeButton: PropTypes.func,
};
