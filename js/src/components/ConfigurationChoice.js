import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

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

		let buttonProps = {
			label: this.props.button.text,
			primary: this.props.button.type === 'primary',
			disableFocusRipple: true,
			disableTouchRipple: true,
			disableKeyboardFocus: true
		};

		let className = '';

		buttonProps["aria-label"] = this.props.button.text;

		switch ( this.props.button.action ) {
			case 'followURL':
				buttonProps.href = this.props.button.url;
				className = 'yoast-wizard--button yoast-wizard--button__url';
				break;
			case 'nextStep':
				buttonProps.onClick = this.props.nextStep;
				className = 'yoast-wizard--button yoast-wizard--button__next';
				break;
		}

		return (
			<div className="yoast-wizard-box yoast-wizard-columns yoast-wizard-choice">
				<div className="hide-on-mobile">
					<img src={this.props.image} alt={this.props.title}
					     width="100"/></div>
				<div>
					<h3>{this.props.title}</h3>
					<p>{this.props.copy}</p>
					<RaisedButton {...buttonProps} />
				</div>
			</div>
		);
	}
}

export default ConfigurationChoice;
