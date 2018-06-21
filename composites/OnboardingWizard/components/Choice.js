import React from "react";
import PropTypes from "prop-types";

import Input from "../../../forms/Input";
import Label from "../../../forms/Label";
import htmlDecoder from "../helpers/htmlDecoder";
import Explanation from "./Explanation";

/**
 * Represents a choice interface, like a group of radio buttons or a select button. It could render a
 * group of radio buttons (default) or a selectbox.
 *
 * @param {Object} props The properties.
 * @returns {JSX} The choice component.
 * @constructor
 */
const Choice = ( props ) => {
	let choices = props.properties.choices;
	let fieldKeys = Object.keys( choices );
	let fieldName = props.name;
	let type = props.properties.type;

	if ( typeof type === "undefined" ) {
		type = "radio";
	}
	let wrapperClass = "yoast-wizard-input-" + type;

	let fieldSet = () => {
		if ( type === "select" ) {
			/*
			 * Disabled until a solution for the bigger a11y issue is found: unexpectedly triggering
			 * the onchange event for keyboard users.
			 */
			/* eslint-disable jsx-a11y/no-onchange */
			return <fieldset className={"yoast-wizard-input-select-" + fieldName}>
				<select defaultValue={props.value} name={fieldName}
				        className={props.optionClassName} onChange={props.onChange}>
					{fieldKeys.map( ( choiceName, index ) => {
						let choice = choices[ choiceName ];

						return (
							<option value={choiceName} key={index}>
								{htmlDecoder( choice.label )}
							</option>
						);
					} )}
				</select>
			</fieldset>
			;
			/* eslint-enable jsx-a11y/no-onchange */
		}
		return <fieldset className={"yoast-wizard-input-radio-" + fieldName}>
			{fieldKeys.map( ( choiceName, index ) => {
				let choice = choices[ choiceName ];
				let id = `${fieldName}-${index}`;
				// If the value for the choice field equals the name for this choice, the choice is checked.
				let checked = ( props.value === choiceName );

				return (
					<div className={props.optionClassName + " " + choiceName} key={index}>
						<Input name={fieldName} type="radio" label={choice.label} onChange={props.onChange}
							   value={choiceName} optionalAttributes={ { id, checked } }
						/>
						<Label for={id}
							   optionalAttributes={ { "aria-label": choice.screenReaderText } }>{htmlDecoder( choice.label )}</Label>
					</div>
				);
			} )}
		</fieldset>
		;
	};

	return (
		<div className={ wrapperClass }>
			<p className="yoast-wizard-field-description">{ props.properties.label }</p>
			<p>{ props.properties.description }</p>
			{ fieldSet() }
			<Explanation text={ props.properties.explanation }/>
		</div>
	);
};

Choice.propTypes = {
	component: PropTypes.string,
	type: PropTypes.string,
	value: PropTypes.string,
	properties: PropTypes.shape( {
		label: PropTypes.string,
		choices: PropTypes.object,
		explanation: PropTypes.string,
		description: PropTypes.string,
		type: PropTypes.string,
	} ),
	"default": PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	className: PropTypes.string,
	optionClassName: PropTypes.string,
};

Choice.defaultProps = {
	component: "",
	type: "radio",
	value: "",
	properties: {
		label: "",
		choices: {},
		description: "",
	},
	"default": "",
};

export default Choice;
