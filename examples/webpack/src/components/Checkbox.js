import React from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";

class Checkbox extends React.PureComponent {
	/**
	 * Initializes the Checkbox component
	 *
	 * @param {Object}   props             The component's props.
	 * @param {string}   props.id          The id of the checkbox.
	 * @param {string}   props.value       The value of the checkbox.
	 * @param {string}   props.label       The label in front of the checkbox.
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
	 * @param {Event} event The checkbox change event.
	 *
	 * @returns {void}
	 */
	handleChange( event ) {
		const { onChange } = this.props;

		if ( isFunction( onChange ) ) {
			onChange( event.target.checked );
		}
	}

	/**
	 * Renders the Checkbox component.
	 *
	 * @returns {void}
	 */
	render() {
		const { id, value, label } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={ id }>{ label }</label>
				<input
					type="checkbox"
					id={ id }
					name={ id }
					checked={ value }
					onChange={ this.handleChange }
				/>
			</React.Fragment>
		);
	}
}

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	label: PropTypes.string,
	onChange: PropTypes.func,
};

Checkbox.defaultProps = {
	label: "",
};

export default Checkbox;
