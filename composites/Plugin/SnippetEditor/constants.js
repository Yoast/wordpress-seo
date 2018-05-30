import PropTypes from "prop-types";

export const lengthProgressShape = PropTypes.shape( {
	max: PropTypes.number,
	actual: PropTypes.number,
	score: PropTypes.number,
} );

export const replacementVariablesShape = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
} ) );
