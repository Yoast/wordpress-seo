import React from "react";
import RaisedURLNewWindowButton from "./RaisedURLNewWindowButton";
import RaisedNextStepButton from "./RaisedNextStepButton";

class ConfigurationChoice extends React.Component {
	/**
	 * @summary Renders the Choice component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {

		let button;

		switch ( this.props.button.action ) {
			case "followURL":
				button = <RaisedURLNewWindowButton { ...this.props.button } />
				break;
			case "nextStep":
				button = <RaisedNextStepButton { ...this.props.button } onClick={ this.props.nextStep }/>
				break;
		}

		return (
			<div className="yoast-wizard--box yoast-wizard--columns yoast-wizard--choice">
				<div className="hide-on-mobile">
					<img src={ this.props.image } alt={ this.props.title }
					     width="100"/></div>
				<div className="yoast-wizard--rows">
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					{ button }
				</div>
			</div>
		);
	}
}

export default ConfigurationChoice;
