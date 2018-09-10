import React from "react";
import PropTypes from "prop-types";

/**
 * Lists the supported input types.
 *
 * @type {string[]}
 */
const inputTypes = [
	"button",
	"checkbox",
	"number",
	"password",
	"progress",
	"radio",
	"submit",
	"text",
];

/**
 * Represents the input HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the input HTML element based on the passed props.
 * @constructor
 */
class Input extends React.Component {
	/**
	 * Determines whether or not the component updated and sets its focus accordingly.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		if ( this.props.hasFocus ) {
			this.ref.focus();
		}
	}

	/**
	 * Sets a reference to the current component.
	 *
	 * @param {Object} ref The reference to set.
	 * @returns {void}
	 */
	setReference( ref ) {
		this.ref = ref;
	}

	/**
	 * Renders a representation of the Input component.
	 *
	 * @returns {JSX.Element} A representation of the Input component.
	 */
	render() {
		return (
			<input
				ref={ this.setReference.bind( this ) }
				type={ this.props.type }
				name={ this.props.name }
				defaultValue={ this.props.value }
				onChange={ this.props.onChange }
				{ ...this.props.optionalAttributes }
			/>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, onChange: function, optionalAttributes:object}}
 */
Input.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.oneOf( inputTypes ).isRequired,

	value: PropTypes.any,
	onChange: PropTypes.func,
	optionalAttributes: PropTypes.object,
	hasFocus: PropTypes.bool,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{type: string, name: string}}
 */
Input.defaultProps = {
	name: "input",
	type: "text",
	value: "",
	hasFocus: false,
};

export default Input;
