import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";

const SEOScoreAssessmentItem = styled.li`
	display:   table-row;
	font-size: 14px;
`;

const SEOScoreAssessmentPart = styled.span`
	display: table-cell;
	padding: 2px;
`;

const SEOScoreAssessmentBullet = styled.span`
	display:          inline-block;
	height:           10px;
	width:            10px;
	margin-right:     10px;
	border-radius:    50%;
	background-color: ${props => props.color};
`;

SEOScoreAssessmentBullet.propTypes = {
	color: PropTypes.string.isRequired,
};

const SEOScoreAssessmentScore = styled( SEOScoreAssessmentPart )`
	font-weight:  bold;
	text-align:   right;
	padding-left: 20px;
`;

const SEOScoreAssessment = ( props ) => {
	let html = props.html;
	console.log( html );
	return (
		<SEOScoreAssessmentItem>
			<SEOScoreAssessmentPart>
				<SEOScoreAssessmentBullet color={ props.color }/>
				<span dangerouslySetInnerHTML={{ __html: html }}></span>
			</SEOScoreAssessmentPart>
			{ props.score &&
				<SEOScoreAssessmentScore>{props.score}</SEOScoreAssessmentScore>
			}
		</SEOScoreAssessmentItem>
	)
};

SEOScoreAssessment.propTypes = {
	color: PropTypes.string.isRequired,
	html:  PropTypes.string.isRequired,
	score: PropTypes.string,
};

export default SEOScoreAssessment;
