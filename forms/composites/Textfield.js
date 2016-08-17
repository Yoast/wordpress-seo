import React from "react";
import Label from "../Label";
import Input from "../Input";
import Textarea from "../Textarea";

class Textfield extends React.Component {

	constructor( props ) {
		super( props );

		this.optionalAttributes = this.parseOptionalAttributes();
	}

	render() {
		return (
			<div>
				<Label for={this.props.name} optionalAttributes={this.optionalAttributes.label}>{this.props.label}</Label>
				{this.determineFieldType()}
			</div>
		);
	}

	determineFieldType() {
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
	onChange: React.PropTypes.func.isRequired,
	optionalAttributes: React.PropTypes.object,
	multiline: React.PropTypes.bool,
};

export default Textfield;
