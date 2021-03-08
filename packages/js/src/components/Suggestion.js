import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import ArrowForwardIcon from "material-ui/svg-icons/navigation/arrow-forward";
import RaisedURLNewWindowButton from "./RaisedURLNewWindowButton";

/**
 * Renders suggestions for next steps in the config wizard.
 */
class Suggestion extends Component {
	/**
	 * @summary Renders the Suggestion component.
	 *
	 * @returns {wp.Element} Rendered Component.
	 */
	render() {
		const buttonProps = {};

		if ( this.props.button.type === "primary" ) {
			buttonProps.labelPosition = "before";
			buttonProps.icon = <ArrowForwardIcon viewBox="0 0 28 28" />;
		}

		return (
			<div className="yoast-wizard--list yoast-wizard--columns yoast-wizard--suggestion">
				<div className="yoast-wizard--column__push_right">
					<h3 className="yoast-wizard--heading">{ this.props.title }</h3>
					<p>{ this.props.copy }</p>
					<RaisedURLNewWindowButton { ...this.props.button } { ...buttonProps } />
				</div>
				<div className="yoast-wizard--column__push_left yoast-wizard--video-frame">
					<iframe
						width="400" height="225" src={ this.props.video.url } frameBorder="0"
						allowFullScreen={ true }
						title={ this.props.video.title }
					/>
				</div>
			</div>
		);
	}
}

export default Suggestion;

Suggestion.propTypes = {
	title: PropTypes.string.isRequired,
	copy: PropTypes.string.isRequired,
	video: PropTypes.object.isRequired,
	button: PropTypes.object.isRequired,
};
