import React from "react";
import PropTypes from "prop-types";
import { isFunction, noop } from "lodash-es";

import { H3 } from "./headings";
import styled from "styled-components";

const TextInput = styled.input`
	flex: 0 1 100%;
	border: 1px solid ${ ( props ) => props.isActive ? "#5b9dd9" : "#ddd" };
	padding: 3px 5px;
	box-sizing: border-box;
	box-shadow: ${ ( props ) => props.isActive ? "0 0 2px rgba(30,140,190,.8);" : "inset 0 1px 2px rgba(0,0,0,.07)" };
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
	position: relative;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	font-size: 14px;
	cursor: text;
	width: 100%;
`;

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
		const { id, type, onChange } = this.props;

		if ( isFunction( onChange ) ) {
			let name = "value";

			// Exception for a checkbox.
			if ( type === "checkbox" ) {
				name = "checked";
			}

			onChange( id, event.target[ name ] );
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
				<label htmlFor={ id }>
					<H3>
						{ label }
					</H3>
				</label>
				<TextInput
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
	onChange: noop,
};

export default Input;
