import React from "react";
import PropTypes from "prop-types";
import { isFunction, noop } from "lodash-es";
import styled from "styled-components";

import { H3 } from "./headings";

const TextareaInput = styled.textarea` 
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
	min-height: ${ props => props.minHeight };
	margin-top: 8px;
`;

class TextArea extends React.PureComponent {
	/**
	 * Initializes the TextArea component
	 *
	 * @param {Object}   props             The component's props.
	 * @param {string}   props.id          The id of the textarea.
	 * @param {string}   props.value       The value of the textarea.
	 * @param {string}   props.label       The label in front of the textarea.
	 * @param {string}   props.placeholder The placeholder of the textarea.
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
		const { id, onChange } = this.props;

		if ( isFunction( onChange ) ) {
			onChange( id, event.target.value );
		}
	}

	/**
	 * Renders the TextArea component.
	 *
	 * @returns {React.Component} the React TextArea component and header.
	 */
	render() {
		const { id, value, label, placeholder, minHeight } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>
					<H3>
						{ label }
					</H3>
				</label>
				<TextareaInput
					id={ id }
					name={ id }
					value={ value }
					placeholder={ placeholder }
					onChange={ this.handleChange }
					minHeight={ minHeight }
				/>
			</React.Fragment>
		);
	}
}

TextArea.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	minHeight: PropTypes.string,
};

TextArea.defaultProps = {
	label: "",
	placeholder: "",
	onChange: noop,
	minHeight: "300px",
};

export default TextArea;
