import React from "react";

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
	let fieldName = props.fieldName;

	return (
		<div>
			<p className="yoast-wizard-field-description">{props.properties.label}</p>
			<fieldset className={"yoast-wizard-input-" + fieldName}>
				{fieldKeys.map( ( choiceName, index ) => {
					let choice = choices[ choiceName ];
					let choiceId = `${choiceName} - ${index}`;
					// If the value for the choice field equals the name for this choice, the choice is checked.
					let checked = ( props.value === choiceName );

					return (
						<div key={index}>
							<input className={fieldName} onChange={props.onChange} id={choiceId} type="radio"
							       name={fieldName}
							       value={choiceName}
							       checked={checked}/>
							<label htmlFor={choiceId}>
								{choice.label}
							</label>
						</div>
					);
				} )}
			</fieldset>
		</div>
	);
};

Choice.propTypes = {
	component: React.PropTypes.string,
	value: React.PropTypes.string,
	properties: React.PropTypes.object,
	"default": React.PropTypes.string,
	fieldName: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func,
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
