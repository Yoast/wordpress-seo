import React from "react";
import Label from "../Label";
import TextField from "./Textfield";

/**
 * @summary ConditionalTextfield component.
 *
 * This component only renders the TextField component if a required field
 * has the required value.
 */
class ConditionalTextfield extends TextField {

	/**
	 * Sets the properties for the ConditionalTextField.
	 *
	 * @param props The properties.
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * @summary Renders the ConditionalTextField component.
	 *
	 * The ConditionalTextField component only renders the TextField
	 * if the required field has the required value.
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

/**
 * @type {{requires: {object}, requiredFieldValue: string}}
 */
ConditionalTextfield.propTypes = {
	requires: React.PropTypes.requires,
	requiredFieldValue: React.PropTypes.string,
};

/**
 * @type {{requiredFieldValue: string}}
 */
ConditionalTextfield.defaultProps = {
	requiredFieldValue: "",
};

export default ConditionalTextfield;
