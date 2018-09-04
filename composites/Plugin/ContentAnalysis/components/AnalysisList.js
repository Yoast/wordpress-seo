/* External dependencies */
import { __ } from "@wordpress/i18n";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import noop from "lodash/noop";

/* Internal dependencies */
import AnalysisResult from "./AnalysisResult";
import colors from "../../../../style-guide/colors";

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
 * @param {AssessmentResult[]} results                    The results from YoastSEO.js
 * @param {string}             marksButtonActivatedResult The currently activated result.
 * @param {string}             marksButtonStatus          The overal status of the mark buttons.
 * @param {string}             marksButtonClassName       A class name to set on the mark buttons.
 * @param {Function}           onMarksButtonClick         Function that is called when the user
 *                                                        clicks one of the mark buttons.
 *
 * @returns {React.Element} The rendered list.
 */
export default function AnalysisList( { results, marksButtonActivatedResult, marksButtonStatus, marksButtonClassName, onMarksButtonClick } ) {
	return <AnalysisListBase role="list">
		{ results.map( ( result ) => {
			let color = renderRatingToColor( result.rating );
			let isMarkButtonPressed = result.id === marksButtonActivatedResult;

			let ariaLabel = "";
			if ( marksButtonStatus === "disabled" ) {
				ariaLabel = __( "Marks are disabled in current view", "yoast-components" );
			} else if ( isMarkButtonPressed ) {
				ariaLabel = __( "Remove highlight from the text", "yoast-components" );
			} else {
				ariaLabel = __( "Highlight this result in the text", "yoast-components" );
			}

			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				ariaLabel={ ariaLabel }
				pressed={ isMarkButtonPressed }
				buttonId={ result.id }
				onButtonClick={ () => onMarksButtonClick( result.id, result.marker ) }
				marksButtonClassName={ marksButtonClassName }
				marksButtonStatus={ marksButtonStatus }
			/>;
		} ) }
	</AnalysisListBase>;
}

AnalysisList.propTypes = {
	results: PropTypes.array.isRequired,
	marksButtonActivatedResult: PropTypes.string,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	onMarksButtonClick: PropTypes.func,
};

AnalysisList.defaultProps = {
	marksButtonActivatedResult: "",
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	onMarksButtonClick: noop,
};
