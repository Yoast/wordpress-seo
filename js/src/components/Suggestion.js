import { Component } from "@wordpress/element";
import PropTypes from "prop-types";

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
		let buttonClass = "yoast-button yoast-button--secondary";
		const isUpsell = this.props.button.type === "upsell";

		if ( isUpsell ) {
			buttonClass = "yoast-button yoast-button--buy";
		}

		return (
			<div className="yoast-wizard--list yoast-wizard--columns yoast-wizard--suggestion">
				<div className="yoast-wizard--column__push_right">
					<h2 className="yoast-h2">{ this.props.title }</h2>
					<p>{ this.props.copy }</p>
					<a href={ this.props.button.href } target="_blank" className={ buttonClass }>
						{ this.props.button.label }
						{ isUpsell && <span className="yoast-button--buy__caret" /> }
					</a>
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
