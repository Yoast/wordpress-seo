import React from "react";
import PropTypes from "prop-types";

/**
 * Represents a Google search console interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX} The ConnectGoogleSearchConsole component.
 * @constructor
 */
const ConnectGoogleSearchConsole = ( props ) => {
	const data = props.data;

	return (
		<div>
			<h2>{ data.token }</h2>
			<div>{ data.profile }</div>
		</div>
	);
};

ConnectGoogleSearchConsole.propTypes = {
	component: PropTypes.string,
	data: PropTypes.string,
};

ConnectGoogleSearchConsole.defaultProps = {
	component: "",
	data: "",
};

export default ConnectGoogleSearchConsole;
