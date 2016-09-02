import React from "react";
import Input from "../../../forms/Input";
import Label from "../../../forms/Label";
import htmlDecoder from "../helpers/htmlDecoder";

/**
 * Represents a choice interface, like a group of radio buttons or a select button. Initially it should render a
 * group of radio buttons. We might add other representations later on.
 *
 * @param {Object} props The properties.
 * @returns {JSX} The choice component.
 * @constructor
 */
const Choice = ( props ) => {
	let choices = props.properties.choices;
	let fieldKeys = Object.keys( choices );
	let fieldName = props.name;

	let fieldSet  = () => {
		return <fieldset className={"yoast-wizard-input-radio-" + fieldName}>
			{fieldKeys.map( ( choiceName, index ) => {
				let choice = choices[ choiceName ];
				let id = `${choiceName}-${index}`;
				// If the value for the choice field equals the name for this choice, the choice is checked.
				let checked = (props.value === choiceName);

				return (
					<div className={props.optionClassName + " " + choiceName} key={index}>
						<Input name={fieldName} type="radio" label={choice.label} onChange={props.onChange}
						       value={choiceName} optionalAttributes={{ id, checked }}
						/>
						<Label for={id}>{htmlDecoder(choice.label)}</Label>
					</div>
				);
			} )}
		</fieldset>
	};

	return (
		<div className={props.className}>
			<p className="yoast-wizard-field-description">{props.properties.label}</p>
			{fieldSet()}
		</div>
	);
};

Choice.propTypes = {
	component: React.PropTypes.string,
	value: React.PropTypes.string,
	properties: React.PropTypes.object,
	"default": React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func,
	className: React.PropTypes.string,
	optionClassName: React.PropTypes.string,
};

Choice.defaultProps = {
	component: "",
	value: "",
	properties: {
		label: "",
		choices: {},
	},
	"default": "",
};

export default Choice;
