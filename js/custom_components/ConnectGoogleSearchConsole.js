
import React from 'react';

/**
 * Represents a mailchimg signup interface.
 */
class ConnectGoogleSearchConsole extends React.Component {

	constructor() {
		super();
	}

	/**
	 * Renders the choice component with a label and its radio buttons.
	 *
	 * @returns {XML}
	 */
	render() {
		let data = this.props.data;

		return (
			<div>
				<h2>{data.token}</h2>
				<div>{data.profile}</div>

			</div>
		)
	}
}

ConnectGoogleSearchConsole.propTypes = {
	component: React.PropTypes.string,
	data: React.PropTypes.object
};

ConnectGoogleSearchConsole.defaultProps = {
	component: '',
	data: {}
};

export default ConnectGoogleSearchConsole;