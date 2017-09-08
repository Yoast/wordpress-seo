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
		<ScoreAssessmentItem>
			<ScoreAssessmentBullet scoreColor={ props.scoreColor }/>
			<ScoreAssessmentText dangerouslySetInnerHTML={ { __html: props.html } }></ScoreAssessmentText>
			{ props.value &&
				<ScoreAssessmentScore>{ props.value }</ScoreAssessmentScore>
			}
		</ScoreAssessmentItem>
	);
};

ScoreAssessment.propTypes = {
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
		<ScoreAssessmentList role="list">
			{ props.items.map( ( item, index ) =>
				<ScoreAssessment
					key={ index }
					scoreColor={ item.color }
					html={ item.html }
					value={ item.value }/>
			) }
		</ScoreAssessmentList>
	);
};

ScoreAssessments.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			color: PropTypes.string.isRequired,
			html: PropTypes.string.isRequired,
			value: PropTypes.number,
		} )
	),
};

export default ScoreAssessments;
