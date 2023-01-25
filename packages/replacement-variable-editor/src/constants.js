// External dependencies.
import PropTypes from "prop-types";

export const replacementVariablesShape = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	description: PropTypes.string,
	hidden: PropTypes.bool,
} ) );

export const recommendedReplacementVariablesShape = PropTypes.arrayOf(
	PropTypes.string
);
