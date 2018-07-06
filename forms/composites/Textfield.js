import React from "react";
import PropTypes from "prop-types";

import Label from "../Label";
import Input from "../Input";
import Textarea from "../Textarea";
import Explanation from "../../composites/OnboardingWizard/components/Explanation";

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
		this.optionalAttributes = this.parseOptionalAttributes();

		if ( this.props.class ) {
			this.optionalAttributes.container.className = this.props.class;
		}

		return (
			<div {...this.optionalAttributes.container}>
				<Label for={this.props.name} optionalAttributes={this.optionalAttributes.label}>{this.props.label}</Label>
				{this.getTextField()}
			</div>
		);
	}

	/**
	 * Get TextInput or a TextArea component based on the multiline property.
	 *
	 * @returns {JSX.Element} A representation of either the Textfield or Input component.
	 */
	getTextField() {
		if ( this.props.multiline === true ) {
			return (
				<div>
					<Textarea name={this.props.name}
				              id={this.props.name}
				              onChange={this.props.onChange}
				              optionalAttributes={this.optionalAttributes.field}
				              hasFocus={this.props.hasFocus}
				              value={this.props.value}
					/>
					<Explanation text={this.props.explanation}/>
				</div>
			);
		}

		return (
			<div>
				<Input name={this.props.name}
				       id={this.props.name}
				       type="text"
				       onChange={this.props.onChange}
				       value={this.props.value}
				       hasFocus={this.props.hasFocus}
				       optionalAttributes={this.optionalAttributes.field}/>
				<Explanation text={this.props.explanation}/>
			</div>
		);
	}

	/**
	 * Parses the optional attributes and splits them up into individual categories.
	 *
	 * @returns {object} A categorized collection of attributes.
	 */
	parseOptionalAttributes() {
		let containerConfiguration = {};
		let labelConfiguration = {};
		let fieldConfiguration = { id: this.props.name };
		let props = Object.keys( this.props );

		props.forEach( function( propKey ) {
			if ( propKey.startsWith( "label-" ) ) {
				labelConfiguration[ propKey.split( "-" ).pop() ] = this.props[ propKey ];
			}

			if ( propKey.startsWith( "field-" ) ) {
				fieldConfiguration[ propKey.split( "-" ).pop() ] = this.props[ propKey ];
			}

			if ( propKey.startsWith( "container-" ) ) {
				containerConfiguration[ propKey.split( "-" ).pop() ] = this.props[ propKey ];
			}

			return;
		}.bind( this ) );

		return { label: labelConfiguration, field: fieldConfiguration, container: containerConfiguration };
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{type: string, name: string, placeholder: string, value: string, onChange: function, optionalAttributes:object}}
 */
Textfield.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	optionalAttributes: PropTypes.object,
	multiline: PropTypes.bool,
	hasFocus: PropTypes.bool,
	"class": PropTypes.string,
	explanation: PropTypes.string,
};

Textfield.defaultProps = {
	optionalAttributes: {},
	multiline: false,
	hasFocus: false,
};

export default Textfield;
