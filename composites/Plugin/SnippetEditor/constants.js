import PropTypes from "prop-types";

export const lengthAssessmentShape = PropTypes.shape( {
	max: PropTypes.number,
	actual: PropTypes.number,
	score: PropTypes.number,
} );
