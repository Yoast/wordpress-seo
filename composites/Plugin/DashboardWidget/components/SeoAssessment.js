import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import StackedProgressBar from "../../Shared/components/StackedProgressBar";
import SeoScoreAssessments from "../../Shared/components/ScoreAssessments";

/**
 * SeoAssessment container.
 */
const SeoAssessmentContainer = styled.div`
`;

/**
 * SeoAssessment top text.
 */
const SeoAssessmentText = styled.p`
	font-size: 14px;
`;

/**
 * The Dashboard Seo Assessment component.
 *
 * @param {object} props The component props.
 *
 * @returns {ReactElement} The react component.
 */
const SeoAssessment = ( props ) => {
	return (
		<SeoAssessmentContainer>
			<SeoAssessmentText>
				{ props.seoAssessmentText }
			</SeoAssessmentText>
			<StackedProgressBar
				items={ props.seoAssessmentItems }
				barHeight={ props.barHeight }
				/>
			<SeoScoreAssessments
				items={ props.seoAssessmentItems }
				/>
		</SeoAssessmentContainer>
	);
};

SeoAssessment.propTypes = {
	seoAssessmentText: PropTypes.string,
	seoAssessmentItems: PropTypes.arrayOf(
		PropTypes.shape( {
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
		} )
	),
	barHeight: PropTypes.string,
};

export default SeoAssessment;
