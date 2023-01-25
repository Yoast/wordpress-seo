import React from "react";
import PropTypes from "prop-types";

/**
 * Represents the textarea HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the textarea HTML element based on the passed props.
 * @constructor
 */
class Textarea extends React.Component {
	/**
	 * Textarea component constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );

		this.setReference = this.setReference.bind( this );
	}

	/**
	 * Renders the textarea.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		return (
			<textarea
				ref={ this.setReference }
				name={ this.props.name }
				value={ this.props.value }
				onChange={ this.props.onChange }
				{ ...this.props.optionalAttributes }
			/>
		);
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
	 * Determines whether or not the component updated and sets its focus accordingly.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		if ( this.props.hasFocus ) {
			this.ref.focus();
		}
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{name: string, value: string, onChange:function, optionalAttributes: object}}
 */
Textarea.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	optionalAttributes: PropTypes.object,
	hasFocus: PropTypes.bool,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{name: string, value: string, optionalAttributes: object}}
 */
Textarea.defaultProps = {
	name: "textarea",
	value: "",
	hasFocus: false,
	onChange: null,
	optionalAttributes: {},
};

export default Textarea;
