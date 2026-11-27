import { strings } from "@yoast/helpers";
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const { stripTagsFromHtmlString } = strings;

const ALLOWED_TAGS = [ "a", "b", "strong", "em", "i", "span", "p", "ul", "ol", "li", "div" ];

const ScoreAssessmentItem = styled.li`
	display: table-row;
	font-size: 14px;
`;

const ScoreAssessmentPart = styled.span`
	display: table-cell;
	padding: 2px;
`;

const ScoreAssessmentBullet = styled( ScoreAssessmentPart )`
	position: relative;
	top: 1px;
	display: inline-block;
	height: 8px;
	width: 8px;
	border-radius: 50%;
	background-color: ${ props => props.scoreColor };
`;

ScoreAssessmentBullet.propTypes = {
	scoreColor: PropTypes.string.isRequired,
};

const ScoreAssessmentText = styled( ScoreAssessmentPart )`
	padding-left: 8px;
	width: 100%;
`;

const ScoreAssessmentScore = styled( ScoreAssessmentPart )`
	font-weight: 600;
	text-align: right;
	padding-left: 16px;
`;

/**
 * The ScoreAssessmentItem component, with a bullet, text and score.
 *
 * @param {Object} props The component's props.
 * @param {string} props.className The class name of the item.
 * @param {string} props.scoreColor The color of the bullet.
 * @param {string} props.html The HTML text of the assessment.
 * @param {number} [props.value] The score of the assessment.
 *
 * @returns {ReactElement} The ScoreAssessmentItem component.
 */
const ScoreAssessment = ( props ) => {
	return (
		<ScoreAssessmentItem
			className={ `${ props.className }` }
		>
			<ScoreAssessmentBullet
				className={ `${ props.className }-bullet` }
				scoreColor={ props.scoreColor }
			/>
			<ScoreAssessmentText
				className={ `${ props.className }-text` }
				dangerouslySetInnerHTML={ { __html: stripTagsFromHtmlString( props.html, ALLOWED_TAGS ) } }
			/>
			{ props.value &&
				<ScoreAssessmentScore
					className={ `${ props.className }-score` }
				>
					{ props.value }
				</ScoreAssessmentScore>
			}
		</ScoreAssessmentItem>
	);
};

const ScoreAssessmentList = styled.ul`
	display: table;
	box-sizing: border-box;
	list-style: none;
	max-width: 100%;
	min-width: 200px;
	margin: 8px 0;
	padding: 0 8px;
`;

/**
 * The score assessments component, for displaying the results of a number of assessments.
 *
 * @param {Object} props The component's props.
 * @param {string} [props.className="score-assessments"] The class name of the list.
 * @param {Object[]} [props.items] The assessment items.
 * @param {string} props.items[].color The color of the bullet.
 * @param {string} props.items[].html The HTML text of the assessment.
 * @param {number} [props.items[].value] The score of the assessment.
 *
 * @returns {ReactElement} The rendered component.
 */
const ScoreAssessments = ( { className = "score-assessments", ...props } ) => {
	return (
		<ScoreAssessmentList
			className={ className }
			role="list"
		>
			{ props.items.map( ( item, index ) =>
				<ScoreAssessment
					className={ `${ className }__item` }
					key={ index }
					scoreColor={ item.color }
					html={ item.html }
					value={ item.value }
				/>
			) }
		</ScoreAssessmentList>
	);
};

export default ScoreAssessments;
