import React from "react";
import PropTypes from "prop-types";

/**
 * Represents a mailchimg signup interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The mailchimg signup component.
 * @constructor
 */
const MailchimpSignup = ( props ) => {
	return (
		<div>
			<h2>{ props.properties.label }</h2>
			<p>{ props.properties.mailchimpActionUrl }</p>
			<input onChange={ props.onChange } type="text" name={ props.name }  defaultValue={ props.properties.currentUserEmail } />
		</div>
	);
};

MailchimpSignup.propTypes = {
	component: PropTypes.string,
	name: PropTypes.string.isRequired,
	properties: PropTypes.object,
	data: PropTypes.string,
	onChange: PropTypes.func,
};

MailchimpSignup.defaultProps = {
	component: "",
	name: "",
	properties: {},
	data: "",
};

export default MailchimpSignup;
