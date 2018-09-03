import React from "react";
import PropTypes from "prop-types";
import { isFunction } from "lodash-es";

class Input extends React.PureComponent {
	/**
	 * Initializes the Input component
	 *
	 * @param {Object}   props             The component's props.
	 * @param {string}   props.id          The id of the input.
	 * @param {string}   props.type        The type of the input.
	 * @param {string}   props.value       The value of the input.
	 * @param {string}   props.label       The label in front of the input.
	 * @param {string}   props.placeholder The placeholder of the input.
	 * @param {function} props.onChange    Callback to receive the new text.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * Calls the onChange prop with the changed text.
	 *
	 * @param {Event} event The input change event.
	 *
	 * @returns {void}
	 */
	handleChange( event ) {
		const { type, onChange } = this.props;

		if ( isFunction( onChange ) ) {
			let name = "value";

			// Exception for a checkbox.
			if ( type === "checkbox" ) {
				name = "checked";
			}

			onChange( event.target[ name ] );
		}
	}

	/**
	 * Renders the Input component.
	 *
	 * @returns {void}
	 */
	render() {
		const { id, type, value, label, placeholder } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>{ label }</label>
				<input
					type={ type }
					id={ id }
					name={ id }
					value={ value }
					placeholder={ placeholder }
					onChange={ this.handleChange }
				/>
			</React.Fragment>
		);
	}
}

Input.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string,
	value: PropTypes.any.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
};

Input.defaultProps = {
	type: "text",
	label: "",
	placeholder: "",
};

export default Input;
