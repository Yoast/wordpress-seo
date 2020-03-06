import { Component } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { Fragment } from "react";

/**
 * Class that creates a react wrapper for radio buttons around a hidden input field.
 */
export default class RadioButtons extends Component {
	/**
	 * Sets the initial state and bind the changeHiddenInput function to the class.
	 *
	 * @returns {void} Nothing.
	 */
	constructor() {
		super();
		this.state = {
			selected: parseInt( document.querySelector( this.props.hiddenComponentId ).value, 10 ),
		};
		this.changeHiddenInput = this.changeHiddenInput.bind( this );
	}

	/**
	 * Updates the hidden input field with the correct value.
	 *
	 * @param {object} event The event that is fired.
	 *
	 * @returns {void} Nothing.
	 */
	changeHiddenInput( event ) {
		const value = event.target.value;
		this.setState( { selected: parseInt( value, 10 ) } );
		document.querySelector( this.props.hiddenComponentId ).value = value;
	}

	/**
	 * Generates an array of Fragments containing a radio button and a label from the options prop.
	 *
	 * @returns {Fragment[]} An array of Fragments.
	 */
	generateButtonGroup() {
		return this.props.options.map( ( option, index ) => {
			return (
				<Fragment
					key={ `${ this.props.componentId }_${ index }` }
				>
					<input
						type="radio"
						name={ this.props.componentId }
						id={ `${ this.props.componentId }_${ index }` }
						value={ index }
						checked={ this.state.selected === index }
						onChange={ this.changeHiddenInput }
					/>
					<label
						htmlFor={ `${ this.props.componentId }_${ index }` }
					>
						{ option }
					</label>
				</Fragment>
			);
		} );
	}

	/**
	 * Returns a fieldset containing all the radio buttons and labels that were provided via the options.
	 *
	 * @returns {Component} A group of radio buttons with a label.
	 */
	render() {
		return (
			<fieldset>
				{ this.generateButtonGroup() }
			</fieldset>
		);
	}
}

RadioButtons.propTypes = {
	componentId: PropTypes.string.isRequired,
	hiddenComponentId: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,
};
