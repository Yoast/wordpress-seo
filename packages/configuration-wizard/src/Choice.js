/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { Input, Label } from "@yoast/components";
import { decodeHTML } from "@yoast/helpers";

/**
 * Represents a choice interface, like a group of radio buttons or a select button. It could render a
 * group of radio buttons (default) or a selectbox.
 *
 * @param {Object} props The properties.
 * @returns {JSX} The choice component.
 * @constructor
 */
const Choice = ( props ) => {
	const choices = props.properties.choices;
	const fieldKeys = Object.keys( choices );
	const fieldName = props.name;
	let type = props.properties.type;

	if ( typeof type === "undefined" ) {
		type = "radio";
	}
	const wrapperClass = "yoast-wizard-input-" + type;

	/**
	 * Returns a select or radio fieldset component.
	 *
	 * @returns {ReactElement} The fieldset component.
	 */
	const fieldSet = () => {
		if ( type === "select" ) {
			/*
			 * Disabled until a solution for the bigger a11y issue is found: unexpectedly triggering
			 * the onchange event for keyboard users.
			 */
			/* eslint-disable jsx-a11y/no-onchange */
			return <fieldset className={ "yoast-wizard-input-select-" + fieldName }>
				<select
					defaultValue={ props.value } name={ fieldName }
					className={ props.optionClassName } onChange={ props.onChange }
				>
					{ fieldKeys.map( ( choiceName, index ) => {
						const choice = choices[ choiceName ];

						return (
							<option value={ choiceName } key={ index }>
								{ decodeHTML( choice.label ) }
							</option>
						);
					} ) }
				</select>
			</fieldset>
			;
			/* eslint-enable jsx-a11y/no-onchange */
		} else if ( fieldName === "separator" ) {
			return <div className={ "yoast-field-group__title-separator" }>
				{ fieldKeys.map( ( choiceName, index ) => {
					const choice = choices[ choiceName ];
					const id = `${fieldName}-${index}`;
					// If the value for the choice field equals the name for this choice, the choice is checked.
					const checked = ( props.value === choiceName );

					return (
						<Fragment key="fragment">
							<Input
								name={ fieldName } type="radio" label={ choice.label } onChange={ props.onChange }
								value={ choiceName } optionalAttributes={ { id, checked } } className={ "visually-hidden" }
							/>
							<Label
								for={ id }
								optionalAttributes={ { "aria-label": choice.screenReaderText } }
							>{ decodeHTML( choice.label ) }</Label>
						</Fragment>
					);
				} ) }
			</div>
			;
		}
		return <fieldset className={ "yoast-field-group yoast-wizard-input-radio-" + fieldName }>
			{ fieldKeys.map( ( choiceName, index ) => {
				const choice = choices[ choiceName ];
				const id = `${fieldName}-${index}`;
				// If the value for the choice field equals the name for this choice, the choice is checked.
				const checked = ( props.value === choiceName );

				return (
					<div
						className={ "yoast-field-group__radiobutton yoast-field-group__radiobutton--vertical " +
						props.optionClassName + " " + choiceName } key={ index }
					>
						<Input
							name={ fieldName } type="radio" label={ choice.label } onChange={ props.onChange }
							   value={ choiceName } optionalAttributes={ { id, checked } }
						/>
						<Label
							for={ id }
							   optionalAttributes={ { "aria-label": choice.screenReaderText } }
						>{ decodeHTML( choice.label ) }</Label>
					</div>
				);
			} ) }
		</fieldset>
		;
	};

	return (
		<div className={ wrapperClass }>
			<p className="yoast-wizard-field-description">{ props.properties.label }</p>
			<p>{ props.properties.description }</p>
			{ fieldSet() }
			{ props.properties.explanation && (
				<p className="yoast-wizard-input__explanation">
					{ props.properties.explanation }
				</p>
			) }
		</div>
	);
};

Choice.propTypes = {
	type: PropTypes.string,
	value: PropTypes.string,
	properties: PropTypes.shape( {
		label: PropTypes.string,
		choices: PropTypes.array,
		explanation: PropTypes.string,
		description: PropTypes.string,
		type: PropTypes.string,
	} ),
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	optionClassName: PropTypes.string,
};

Choice.defaultProps = {
	type: "radio",
	value: "",
	properties: {
		label: "",
		choices: [],
		description: "",
	},
	onChange: () => null,
	optionClassName: "",
};

export default Choice;
