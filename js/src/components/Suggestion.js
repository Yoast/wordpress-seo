import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";
import InfoIcon from "material-ui/svg-icons/action/info";

class Suggestion extends React.Component {
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
			disableKeyboardFocus: true,
		};

		let className = "yoast-wizard--button yoast-wizard--button__url";

		buttonProps["aria-label"] = this.props.button.text;

		if ( this.props.button.type === "primary" ) {
			buttonProps.labelPosition = "before";
			buttonProps.icon = <ArrowForwardIcon viewBox="0 0 28 28"/>;
		}
		else {
			buttonProps.icon = <InfoIcon viewBox="0 0 28 28"/>;
		}

		return (
			<div className="yoast-wizard--list yoast-wizard--columns yoast-wizard--suggestion">
				<div className="yoast-wizard--column__push_right">
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					<a href={this.props.button.url} target="_blank">
						<RaisedButton { ...buttonProps } className={ className }/>
					</a>
				</div>
				<div className="yoast-wizard--column__push_left yoast-wizard--video-frame">
					<iframe width="400" height="225" src={ this.props.video } frameBorder="0"
					        allowFullScreen/>
				</div>
			</div>
		);
	}
}

export default Suggestion;
