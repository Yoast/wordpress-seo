import React from 'react';

/**
 * Represents a mailchimg signup interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX}
 * @constructor
 */
const MailchimpSignup = ( props ) => {

	return (
		<div>
			<h2>{props.properties.label}</h2>
			<p>{props.properties.mailchimpActionUrl}</p>
			<input onChange={props.onChange} type="text" name={props.name}  defaultValue={props.properties.currentUserEmail} />
		</div>
	)
}

MailchimpSignup.propTypes = {
	component: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	properties: React.PropTypes.object,
	data: React.PropTypes.string,
	onChange: React.PropTypes.func
};

MailchimpSignup.defaultProps = {
	component: '',
	name: '',
	properties: {},
	data: ''
};

export default MailchimpSignup;