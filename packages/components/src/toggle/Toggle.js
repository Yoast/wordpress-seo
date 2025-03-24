import React from "react";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";
// Import the required CSS.
import "./toggle.css";

/**
 * Creates a Toggle component.
 *
 * @param {object} props Props for the component.
 *
 * @returns {React.Component} The Toggle component.
 */
export default class Toggle extends React.Component {
	/**
	 * Constructor for the Toggle component.
	 *
	 * @param {object} props Class properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		this.state = {
			value: props.selected === props.onText ? props.onText : props.offText,
		};
		this.onChangeHandler = this.onChangeHandler.bind( this );
	}

	/**
	 * Handles the onChange event of the Toggle.
	 *
	 * @param {object} event The Change event.
	 *
	 * @returns {void}
	 */
	onChangeHandler( event ) {
		const checked = event.target.checked;
		const value = checked ? this.props.onText : this.props.offText;
		this.setState( {
			value,
		} );
		this.props.onChange( value );
	}

	/**
	 * Render function for the Toggle component.
	 *
	 * @returns {React.Component} The Toggle component.
	 */
	render() {
		const {
			id,
			name,
			selected,
			disabled,
			offText,
			onText,
			...fieldGroupProps
		} = this.props;
		return (
			<FieldGroup
				htmlFor={ id }
				{ ...fieldGroupProps }
				wrapperClassName="yoast-toggle__item"
				titleClassName="yoast-toggle__item-title"
			>
				<div className="yoast-toggle">
					<input
						type="checkbox"
						id={ id }
						name={ name }
						value={ this.state.value }
						defaultChecked={ selected === onText }
						disabled={ disabled }
						onChange={ this.onChangeHandler }
						className="yoast-toggle__checkbox"
					/>
					<span className="yoast-toggle__switch" />
					<span className="yoast-toggle--inactive">{ offText }</span>
					<span className="yoast-toggle--active">{ onText }</span>
				</div>
			</FieldGroup>
		);
	}
}

Toggle.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	offText: PropTypes.string.isRequired,
	onText: PropTypes.string.isRequired,
	selected: PropTypes.string,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};

Toggle.defaultProps = {
	selected: "",
	disabled: false,
	onChange: () => {},
};
