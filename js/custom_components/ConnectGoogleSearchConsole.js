
import React from 'react';

/**
 * Represents a mailchimg signup interface.
 *
 * @param {Object} props The properties for the object.
 * @returns {JSX}
 * @constructor
 */
const ConnectGoogleSearchConsole = ( props ) => {
	let data = props.data;

	return (
		<div>
			<h2>{data.token}</h2>
			<div>{data.profile}</div>
		</div>
	);
};

ConnectGoogleSearchConsole.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.object
};

ConnectGoogleSearchConsole.defaultProps = {
	component: '',
	data: {}
};

export default ConnectGoogleSearchConsole;