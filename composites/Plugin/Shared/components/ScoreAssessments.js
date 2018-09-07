import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
				dangerouslySetInnerHTML={ { __html: props.html } }
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

ScoreAssessment.propTypes = {
	className: PropTypes.string.isRequired,
	scoreColor: PropTypes.string.isRequired,
	html: PropTypes.string.isRequired,
	value: PropTypes.number,
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

const ScoreAssessments = ( props ) => {
	return (
		<ScoreAssessmentList
			className={ props.className }
			role="list"
		>
			{ props.items.map( ( item, index ) =>
				<ScoreAssessment
					className={ `${ props.className }__item` }
					key={ index }
					scoreColor={ item.color }
					html={ item.html }
					value={ item.value }
				/>
			) }
		</ScoreAssessmentList>
	);
};

ScoreAssessments.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			color: PropTypes.string.isRequired,
			html: PropTypes.string.isRequired,
			value: PropTypes.number,
		} )
	),
};

ScoreAssessments.defaultProps = {
	className: "score-assessments",
};

export default ScoreAssessments;
