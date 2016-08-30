import React from "react";
import Label from "../Label";
import TextField from "./Textfield";

/**
 * @summary ConditionalTextfield component.
 *
 * This component only renders the TextField component if a required field
 * has the required value.
 *
 */
class ConditionalTextfield extends TextField {

	constructor( props ){
		super(props);
	}

	/**
	 * Renders the ConditionalTextField component.
	 *
	 * @returns {JSX.Element} A representation of the TextField component.
	 */
	render() {
		let showField = (this.props.requiredFieldValue === this.props.requires.value);

		if(showField) {
			return (
				<div className={this.props.optionalAttributes.class}>
					<Label for={this.props.name}
					       optionalAttributes={this.optionalAttributes.label}>
						{this.props.label}
					</Label>
					{this.getTextField()}
				</div>
			);
		}
		return null;
	}
}

ConditionalTextfield.propTypes = {
	requires: React.PropTypes.shape( {
		field: React.PropTypes.string.required,
		value: React.PropTypes.string.required,
	} ),
	requiredFieldValue: React.PropTypes.string,
};

ConditionalTextfield.defaultProps = {
	requiredFieldValue: "",
};

export default ConditionalTextfield;
