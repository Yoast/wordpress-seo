import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SEOScoreAssessment from "./SEOScoreAssessment";

const SEOScoreAssessmentList = styled.ul`
	display:    table;
	list-style: none;
`;

const SEOScoreAssessments = ( props ) => {
	return (
		<SEOScoreAssessmentList>
			{ props.items.map( ( item, index ) =>
				<SEOScoreAssessment
					key={ index }
					color={ item.color }
					html={ item.html }
					score={ item.score }/>
			) }
		</SEOScoreAssessmentList>
	);
};

SEOScoreAssessments.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			color: PropTypes.string.isRequired,
			html:  PropTypes.string.isRequired,
			score: PropTypes.string,
		} )
	)
};

export default SEOScoreAssessments;
