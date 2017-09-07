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
	background-color: ${ props => props.color };
`;

ScoreAssessmentBullet.propTypes = {
	color: PropTypes.string.isRequired,
};

const ScoreAssessmentText = styled( ScoreAssessmentPart )`
	padding-left: 8px;
`;

const ScoreAssessmentScore = styled( ScoreAssessmentPart )`
	font-weight: 600;
	text-align: right;
	padding-left: 16px;
`;

const ScoreAssessment = ( props ) => {
	return (
		<ScoreAssessmentItem>
			<ScoreAssessmentBullet color={ props.color }/>
			<ScoreAssessmentText dangerouslySetInnerHTML={ { __html: props.html } }></ScoreAssessmentText>
			{ props.score &&
				<ScoreAssessmentScore>{ props.score }</ScoreAssessmentScore>
			}
		</ScoreAssessmentItem>
	);
};

ScoreAssessment.propTypes = {
	color: PropTypes.string.isRequired,
	html: PropTypes.string.isRequired,
	score: PropTypes.string,
};

const ScoreAssessmentList = styled.ul`
	display: table;
	box-sizing: border-box;
	list-style: none;
	max-width: 100%;
	margin: 0;
	padding: 5px;
`;

const ScoreAssessments = ( props ) => {
	return (
		<ScoreAssessmentList>
			{ props.items.map( ( item, index ) =>
				<ScoreAssessment
					key={ index }
					color={ item.color }
					html={ item.html }
					score={ item.score }/>
			) }
		</ScoreAssessmentList>
	);
};

ScoreAssessments.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			color: PropTypes.string.isRequired,
			html: PropTypes.string.isRequired,
			score: PropTypes.string,
		} )
	),
};

export default ScoreAssessments;
