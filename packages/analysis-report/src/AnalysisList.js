/* External dependencies */
import { __ } from "@wordpress/i18n";
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
 * @returns {React.Element} The rendered tree.
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
 * @param {MappedResult[]}     results                    The results from YoastSEO.js
 * @param {string}             marksButtonActivatedResult The currently activated result.
 * @param {string}             marksButtonStatus          The overall status of the mark buttons.
 * @param {string}             marksButtonClassName       A class name to set on the mark buttons.
 * @param {string}             editButtonClassName        A class name to set on the edit buttons.
 * @param {Function}           onMarksButtonClick         Function that is called when the user
 *                                                        clicks one of the mark buttons.
 * @param {Function}           onEditButtonClick          Function that is called when the user
 *                                                        clicks one of the edit buttons.
 *
 * @returns {React.Element} The rendered list.
 */
export default function AnalysisList( { results, marksButtonActivatedResult, marksButtonStatus, marksButtonClassName, editButtonClassName, onMarksButtonClick, onEditButtonClick } ) {
	return <AnalysisListBase role="list">
		{ results.map( ( result ) => {
			const color = renderRatingToColor( result.rating );
			const isMarkButtonPressed = result.markerId === marksButtonActivatedResult;

			const markButtonId = result.id + "Mark";
			const editButtonId = result.id + "Edit";

			let ariaLabelMarks = "";
			if ( marksButtonStatus === "disabled" ) {
				ariaLabelMarks = __( "Marks are disabled in current view", "wordpress-seo" );
			} else if ( isMarkButtonPressed ) {
				ariaLabelMarks = __( "Remove highlight from the text", "wordpress-seo" );
			} else {
				ariaLabelMarks = __( "Highlight this result in the text", "wordpress-seo" );
			}

			const ariaLabelEdit = __( "Jump to an edit field to make the suggested change", "wordpress-seo" );

			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				hasEditButton={ result.hasJumps }
				ariaLabelMarks={ ariaLabelMarks }
				ariaLabelEdit={ ariaLabelEdit }
				pressed={ isMarkButtonPressed }
				suppressedText={ result.rating === "upsell" }
				buttonIdMarks={ markButtonId }
				buttonIdEdit={ editButtonId }
				onButtonClickMarks={ () => onMarksButtonClick( result.id, result.marker ) }
				onButtonClickEdit={ () => onEditButtonClick( result.id ) }
				marksButtonClassName={ marksButtonClassName }
				editButtonClassName={ editButtonClassName }
				marksButtonStatus={ marksButtonStatus }
				hasBetaBadgeLabel={ result.hasBetaBadge }
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
	onMarksButtonClick: PropTypes.func,
	onEditButtonClick: PropTypes.func,
};

AnalysisList.defaultProps = {
	marksButtonActivatedResult: "",
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	onMarksButtonClick: noop,
	onEditButtonClick: noop,
};
