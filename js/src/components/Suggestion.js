import React from "react";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";
import RaisedURLNewWindowButton from "./RaisedURLNewWindowButton";

class Suggestion extends React.Component {
	/**
	 * @summary Renders the Suggestion component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {
		let buttonProps = {};

		if ( this.props.button.type === "primary" ) {
			buttonProps.labelPosition = "before";
			buttonProps.icon = <ArrowForwardIcon viewBox="0 0 28 28"/>;
		}

		return (
			<div className="yoast-wizard--list yoast-wizard--columns yoast-wizard--suggestion">
				<div className="yoast-wizard--column__push_right">
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					<RaisedURLNewWindowButton { ...this.props.button } { ...buttonProps } />
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

Suggestion.PropTypes = {
	title: React.PropTypes.string.isRequired,
	copy: React.PropTypes.string.isRequired,
	video: React.PropTypes.string.isRequired,
	button: React.PropTypes.array.isRequired,
};
