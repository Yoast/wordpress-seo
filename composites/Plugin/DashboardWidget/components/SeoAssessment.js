import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import StackedProgressBar from "../../Shared/components/StackedProgressBar";
import SeoScoreAssessments from "../../Shared/components/ScoreAssessments";

const SeoAssassmentContainer = styled.div`
`;

const SeoAssassmentText = styled.p`
	font-size: 14px;
`;

/**
 * The Dashboard Seo Assessment component.
 *
 * @param {object} props The component props.
 *
 * @returns {ReactElement} The react component.
 */
const SeoAssessment  = ( props ) => {
	return (
		<SeoAssassmentContainer>
			<SeoAssassmentText>
				{ props.seoAssessmentText }
			</SeoAssassmentText>
			<StackedProgressBar
				items={ props.seoAssessmentItems }
				barHeight={ props.barHeight }
				/>
			<SeoScoreAssessments
				items={ props.seoAssessmentItems }
				/>
		</SeoAssassmentContainer>
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
