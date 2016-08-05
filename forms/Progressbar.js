import React from 'react';

/**
 * Represents the progress HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
 * @constructor
 */
const Progressbar = ( props ) => {
	return (
		<progress defaultValue={props.value} min={props.min} max={props.max} {...props.optionalAttributes} />
	);
}

/**
 * Adds validation for the properties.
 *
 * @type {{min: number, max: number, value: number, optionalAttributes:object}}
 */
Progressbar.propTypes = {
	value: React.PropTypes.number.isRequired,

	onChange: React.PropTypes.func,
	min: React.PropTypes.number,
	max: React.PropTypes.number,
	optionalAttributes: React.PropTypes.object,

};

/**
 * Defines the default values for the properties.
 *
 * @type {{min: number, max: number, value: number}}
 */
Progressbar.defaultProps = {
	min: 0,
	max: 1,
	value: 0,
};

export default Progressbar;
