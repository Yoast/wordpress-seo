import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";
import InfoIcon from "material-ui/svg-icons/action/info";

class ConfigurationChoice extends React.Component {
	/**
	 * @summary Renders the Choice component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {

		let buttonProps = {
			label: this.props.button.text,
			primary: this.props.button.type === "primary",
			disableFocusRipple: true,
			disableTouchRipple: true,
			disableKeyboardFocus: true
		};

		buttonProps["aria-label"] = this.props.button.text;

		switch ( this.props.button.action ) {
			case "followURL":
				buttonProps.href = this.props.button.url;
				buttonProps.icon = <InfoIcon viewBox="0 0 28 28" />;
				break;
			case "nextStep":
				buttonProps.onClick = this.props.nextStep;
				buttonProps.labelPosition = "before";
				buttonProps.icon = <ArrowForwardIcon viewBox="0 0 28 28" />;
				break;
		}

		return (
			<div className="yoast-wizard--box yoast-wizard--columns yoast-wizard--choice">
				<div className="hide-on-mobile">
					<img src={ this.props.image } alt={ this.props.title }
					     width="100"/></div>
				<div>
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					<RaisedButton { ...buttonProps }/>
				</div>
			</div>
		);
	}
}

export default ConfigurationChoice;
