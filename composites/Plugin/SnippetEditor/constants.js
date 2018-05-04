import PropTypes from "prop-types";

export const lengthProgressShape = PropTypes.shape( {
	max: PropTypes.number,
	min: PropTypes.number,
	actual: PropTypes.number,
	score: PropTypes.number,
} );

export const replacementVariablesShape = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string,
	value: PropTypes.string,
} ) );
