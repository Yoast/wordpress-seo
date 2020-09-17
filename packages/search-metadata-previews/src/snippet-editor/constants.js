// External dependencies.
import PropTypes from "prop-types";

export const lengthProgressShape = PropTypes.shape( {
	max: PropTypes.number,
	actual: PropTypes.number,
	score: PropTypes.number,
} );
