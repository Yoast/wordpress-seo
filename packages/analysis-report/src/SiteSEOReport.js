import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { StackedProgressBar, ScoreAssessments as SeoScoreAssessments } from "@yoast/components";

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
const SiteSEOReport = ( props ) => {
	return (
		<SeoAssessmentContainer
			className={ props.className }
		>
			<SeoAssessmentText
				className={ `${ props.className }__text` }
			>
				{ props.seoAssessmentText }
			</SeoAssessmentText>
			<StackedProgressBar
				className="progress"
				items={ props.seoAssessmentItems }
				barHeight={ props.barHeight }
			/>
			<SeoScoreAssessments
				className="assessments"
				items={ props.seoAssessmentItems }
			/>
		</SeoAssessmentContainer>
	);
};

SiteSEOReport.propTypes = {
	className: PropTypes.string,
	seoAssessmentText: PropTypes.string,
	seoAssessmentItems: PropTypes.arrayOf(
		PropTypes.shape( {
			html: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
		} )
	),
	barHeight: PropTypes.string,
};

SiteSEOReport.defaultProps = {
	className: "seo-assessment",
	seoAssessmentText: "SEO Assessment",
	seoAssessmentItems: null,
	barHeight: null,
};

export default SiteSEOReport;
