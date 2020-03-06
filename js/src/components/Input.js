import { Component } from "@wordpress/element";
import { PropTypes } from "prop-types";

/**
 * React wrapper for a text input that changes a hidden input.
 */
export default class Input extends Component {
	/**
	 * Constructor is only used for binding the update function.
	 *
	 * @param {object} props The properties of the component.
	 *
	 * @returns {void} Nothing.
	 */
	constructor( props ) {
		super( props );
		this.changeHiddenInput = this.changeHiddenInput.bind( this );
	}


	/**
	 * Updates the hidden input with the new value.
	 *
	 * @param {object} event The event that fired.
	 *
	 * @returns {void} Nothing.
	 */
	changeHiddenInput( event ) {
		document.querySelector( this.props.hiddenInputId ).value = event.target.value;
	}

	/**
	 * Renders an input field that changes the hidden input field.
	 *
	 * The defaultValue is taken from the hidden input field.
	 *
	 * @returns {Component} An input field.
	 */
	render() {
		const value = document.querySelector( this.props.hiddenInputId ).value || this.props.defaultValue;
		return (
			<input
				type="text"
				className="large-text"
				id={ this.props.componentId }
				onChange={ this.changeHiddenInput }
				defaultValue={ value }
			/>
		);
	}
}

Input.propTypes = {
	componentId: PropTypes.string.isRequired,
	hiddenInputId: PropTypes.string.isRequired,
	defaultValue: PropTypes.string,
};

Input.defaultProps = {
	defaultValue: "",
};
