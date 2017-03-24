import React from 'react';

class ConfigurationChoice extends React.Component {
	/**
	 * @summary Renders the Choice component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {

		/*
		 @todo: Depending on the `action` we perform an action
		 - open a new window with the link provided
		 - go to the next step in the wizard

		 @todo: add the image

		 @todo: style the button (icon, color, buttonRaised)
		 */

		return (
		<div className="yoast-wizard-box yoast-wizard-columns">
			<div className="hide-on-mobile">[Image]</div>
			<div>
				<h3>{this.props.data.title}</h3>
				<p>{this.props.data.copy}</p>
				<p><button>{this.props.data.button.text}</button></p>
			</div>
		</div>
		);
	}
}

export default ConfigurationChoice;
