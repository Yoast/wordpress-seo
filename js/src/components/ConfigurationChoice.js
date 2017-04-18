import React from "react";
import RaisedURLNewWindowButton from "./RaisedURLNewWindowButton";
import RaisedNextStepButton from "./RaisedNextStepButton";

class ConfigurationChoice extends React.Component {
	/**
	 * Creates a button element based on the button action.
	 *
	 * @returns {JSX.Element} The button to be displayed for the specified action.
	 */
	getButton() {
		switch ( this.props.button.action ) {
			case "followURL":
				return <RaisedURLNewWindowButton { ...this.props.button } />;
			case "nextStep":
				return <RaisedNextStepButton { ...this.props.button } onClick={ this.props.nextStep }/>;
		}
	}

	/**
	 * @summary Renders the Choice component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {
		return (
			<div className="yoast-wizard--box yoast-wizard--columns yoast-wizard--choice">
				<div className="hide-on-mobile">
					<img src={ this.props.image } alt={ this.props.title }
						width="100"/></div>
				<div className="yoast-wizard--rows">
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					{ this.getButton() }
				</div>
			</div>
		);
	}
}

export default ConfigurationChoice;

ConfigurationChoice.propTypes = {
	title: React.PropTypes.string.isRequired,
	copy: React.PropTypes.string.isRequired,
	image: React.PropTypes.string.isRequired,
	button: React.PropTypes.object.isRequired,
	nextStep: React.PropTypes.func.isRequired,
};
