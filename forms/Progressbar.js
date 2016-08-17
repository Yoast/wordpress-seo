import React from "react";

/**
 * Represents the progress HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the progress HTML element based on the passed props.
 * @constructor
 */
const Progressbar = ( props ) => {
	if ( typeof document.createElement( "progress" ) === "undefined" ) {
		return (
			<div {...props.optionalAttributes}></div>
		);
	}

	return (
		<progress name={props.name}
		          value={props.value}
		          min={props.min}
		          max={props.max}
		          {...props.optionalAttributes}
		/>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{min: number, max: number, value: number, optionalAttributes:object}}
 */
Progressbar.propTypes = {
	value: React.PropTypes.number.isRequired,

	name: React.PropTypes.string,
	onChange: React.PropTypes.func,
	min: React.PropTypes.number,
	max: React.PropTypes.number,
	optionalAttributes: React.PropTypes.shape( {
		className: React.PropTypes.string,
	} ),
};

/**
 * Defines the default values for the properties.
 *
 * @type {{min: number, max: number, value: number}}
 */
Progressbar.defaultProps = {
	min: 0,
	max: 1,
	className: "",
	optionalAttributes: {
		className: "",
	},
};

export default Progressbar;
