import React from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";

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
		const { onChange } = this.props;

		if ( isFunction( onChange ) ) {
			onChange( event.target.value );
		}
	}

	/**
	 * Renders the TextArea component.
	 *
	 * @returns {void}
	 */
	render() {
		const { id, value, label, placeholder } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>{ label }</label>
				<textarea
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

TextArea.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
};

TextArea.defaultProps = {
	label: "",
	placeholder: "",
};

export default TextArea;
