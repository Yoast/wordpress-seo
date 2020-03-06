import { Component } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * Wrapper class for a hidden input that used to be an select.
 *
 * This class creates a select in the HTML and uses select2 to create a select2 select from it after it has mounted.
 */
export class SingleSelect extends Component {
	/**
	 * Create a select2 component from the select and listen to the change action.0
	 *
	 * @returns {void} Nothing.
	 */
	componentDidMount() {
		this.select2 = jQuery( `#${ this.props.componentId }` );
		this.select2.select2( { width: "100%" } );
		this.select2.on( "change.select2", e => this.changeHiddenInput( e.target ) );
	}

	/**
	 * Sets the value of the hiddenInput field to the value from the select2.
	 *
	 * @param {object} target The event target.
	 *
	 * @returns {void} Nothing.
	 */
	changeHiddenInput( target ) {
		document.querySelector( this.props.hiddenInputId ).value = target.value;
	}

	/**
	 * Renders a "normal" HTML select with the value from the hidden input field.
	 *
	 * @returns {Component} A select component.
	 */
	render() {
		const selected = document.querySelector( this.props.hiddenInputId ).value || this.props.defaultValue;
		return (
			<select
				id={ this.props.componentId }
				defaultValue={ selected }
			>
				{ this.props.options.map( option => {
					return <option key={ option.value } value={ option.value }>{ option.name }</option>;
				} ) }
			</select>
		);
	}
}

SingleSelect.propTypes = {
	options: PropTypes.arrayOf( PropTypes.shape( { name: PropTypes.string, value: PropTypes.string } ) ).isRequired,
	componentId: PropTypes.string.isRequired,
	hiddenInputId: PropTypes.string.isRequired,
	defaultValue: PropTypes.string,
};

SingleSelect.defaultProps = {
	defaultValue: "",
};

/**
 * This class adds functionality to the SingleSelect so that it works for multiselects.
 */
export class MultipleSelect extends SingleSelect {
	/**
	 * Overloads the parent function.
	 *
	 * Creates a single string with comma's from the selected values in the multiselect.
	 *
	 * @param {object} target The event target.
	 *
	 * @returns {void} Nothing.
	 */
	changeHiddenInput( target ) {
		let value = "";
		for ( const selection of target.selectedOptions ) {
			value += `${ selection.value },`;
		}

		// Throw away the last comma.
		value = value.slice( 0, -1 );

		// Use the parent function to actually set the value on the hidden input.
		super.changeHiddenInput( { value } );
	}

	/**
	 * Renders a multiselect populated with the options provided.
	 *
	 * The selected attributes are obtained from the hidden input field.
	 *
	 * @returns {Component} The multiselect.
	 */
	render() {
		let selected = document.querySelector( this.props.hiddenInputId ).value || this.props.default;

		// Calling split() on an empty string results in [ "" ] which is exactly what we want.
		// This means that there are no values selected in the multiselect.
		selected = selected.split( "," );

		return (
			<select
				multiple="multiple"
				id={ this.props.componentId }
				defaultValue={ selected }
			>
				{ this.props.options.map( option => {
					return <option key={ option.value } value={ option.value }>{ option.name }</option>;
				} ) }
			</select>
		);
	}
}
