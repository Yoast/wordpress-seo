import React from 'react';

/**
 * Represents a choice interface, like a group of radio buttons or a select button. Initially it should render a
 * group of radio buttons. We might add other representations later on.
 *
 * @param {Object} props The properties.
 * @returns {JSX}
 * @constructor
 */
const Choice = ( props ) => {
	let choices = props.properties.choices;
	let fieldKeys = Object.keys( choices );
	let fieldName = props.fieldName;

	return (
		<div>
			<h2>{props.properties.label}</h2>
			{fieldKeys.map( function ( choiceName, index ) {
				let choice = choices[ choiceName ];
				let choiceId = choiceName + '-' + index;
				let isChecked = (props.data == choiceName) ? "checked" : "";

				return (
					<div key={index}>
						<input onChange={props.onChange} id={choiceId} type="radio" name={fieldName}
						       value={choiceName} checked={isChecked} />
						<label htmlFor={choiceId}>{choice.label}</label>
					</div>
				);
			} )}
		</div>
	);
};

Choice.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.string,
	properties: React.PropTypes.object,
	default: React.PropTypes.string,
	fieldName: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func
};

Choice.defaultProps = {
	component: '',
	data: '',
	properties: {
		label: '',
		choices: {}
	},
	default: '',
	fieldName: ''
};

export default Choice;