import React from 'react';

/**
 * Represents a mailchimg signup interface.
 */
class MailchimpSignup extends React.Component {

	constructor() {
		super();
	}

	/**
	 * Sets the current state
	 */
	componentWillMount() {
		this.setState( this.props );
	}

	/**
	 * Renders the choice component with a label and its radio buttons.
	 *
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<h2>{this.props.properties.label}</h2>
				<p>{this.props.properties.mailchimpActionUrl}</p>
				<input type="text" name={this.props.name}  defaultValue={this.props.properties.currentUserEmail} />

			</div>
		)
	}
}

MailchimpSignup.propTypes = {
	component: React.PropTypes.string,
	properties: React.PropTypes.object,
	data: React.PropTypes.string
};

MailchimpSignup.defaultProps = {
	component: '',
	properties: {},
	data: ''
};

export default MailchimpSignup;