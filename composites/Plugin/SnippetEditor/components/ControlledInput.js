import React from "react";
import PropTypes from "prop-types";
import noop from "lodash/noop";

class ControlledInput extends React.Component {
	/**
	 * Constructs a controlled input.
	 *
	 * @param {Object}   props              The passed props.
	 * @param {string}   props.initialValue The initial value.
	 * @param {Function} props.onChange     On change callback.
	 * @param {Function} props.passedRef    Ref to be placed on the input.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			value: props.initialValue,
		};
	}

	/**
	 * Called when the input has changed.
	 *
	 * Sets the input value in state and calls the onChange callback.
	 *
	 * @param {Object} event The onchange event.
	 *
	 * @returns {void}
	 */
	onChange( event ) {
		this.setState( {
			value: event.target.value,
		}, () => {
			this.props.onChange( this.state.value );
		} );
	}

	/**
	 * Renders the ControlledInput component.
	 *
	 * @returns {ReactComponent} ControlledInput component.
	 */
	render() {
		const {
			/* Remove props that are not used by the input field */
			/* eslint-disable no-unused-vars */
			onChange,
			initialValue,
			/* eslint-enable no-unused-vars */
			passedRef,
			...otherProps
		} = this.props;
		return (
			<input
				{ ...otherProps }
				ref={ passedRef }
				onChange={ this.onChange.bind( this ) }
				value={ this.state.value } />
		);
	}
}

ControlledInput.propTypes = {
	initialValue: PropTypes.string,
	onChange: PropTypes.func,
	passedRef: PropTypes.func,
};

ControlledInput.defaultProps = {
	initialValue: "",
	onChange: noop,
};

export default ControlledInput;
