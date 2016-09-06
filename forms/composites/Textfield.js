import React from "react";

import Label from "../Label";
import Input from "../Input";
import Textarea from "../Textarea";

/**
 * Represents the Textfield composite component.
 */
class Textfield extends React.Component {

	/**
	 * Instantiates a new instance of the TextField and sets its default props.
	 * Also adds some method binding and scoping.
	 *
	 * @param {Object} props The properties to use within the editor.
	 */
	constructor( props ) {
		super( props );

		this.optionalAttributes = this.parseOptionalAttributes();
	}

	/**
	 * Renders the TextField component.
	 *
	 * @returns {JSX.Element} A representation of the TextField component.
	 */
	render() {
		return (
			<div className={this.props.optionalAttributes.class}>
				<Label for={this.props.name} optionalAttributes={this.optionalAttributes.label}>{this.props.label}</Label>
				{this.getTextField()}
			</div>
		);
	}

	/**
	 * Get TextInput or a TextArea component based on the multiline property.
	 *
	 * @returns {JSX.Element} A representation of either the Textarea or Input component.
	 */
	getTextField() {
		if ( this.props.multiline === true ) {
			return (
				<Textarea name={this.props.name}
			              id={this.props.name}
			              onChange={this.props.onChange}
			              optionalAttributes={this.optionalAttributes.field}
			              value={this.props.value}
				/>
			);
		}

		return ( <Input name={this.props.name}
		                id={this.props.name}
		                type="text"
		                onChange={this.props.onChange}
		                value={this.props.value}
		                optionalAttributes={this.optionalAttributes.field} /> );
	}

	/**
	 * Parses the optional attributes and splits them up into individual categories.
	 *
	 * @returns {{label: {}, field: {id: string}}}
	 */
	parseOptionalAttributes() {
		let labelConfiguration = {};
		let fieldConfiguration = { id: this.props.name,	};
		let props = Object.keys(this.props);

		props.forEach( function( propKey ) {
			if ( propKey.startsWith( "label-" ) ) {
				labelConfiguration[propKey.split("-").pop()] = this.props[propKey];
			}

			if ( propKey.startsWith( "field-" ) ) {
				fieldConfiguration[propKey.split("-").pop()] = this.props[propKey];
			}

			return;
		}.bind(this) );

		return { label: labelConfiguration, field: fieldConfiguration, };
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, onChange: function, optionalAttributes:object}}
 */
Textfield.propTypes = {
	label: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func,
	optionalAttributes: React.PropTypes.object,
	multiline: React.PropTypes.bool,
};

Textfield.defaultProps = {
	optionalAttributes: {},
	multiline: false,
};

export default Textfield;
