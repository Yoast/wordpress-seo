import React from "react";
import PropTypes from "prop-types";

class Suggestion extends React.Component {
	/**
	 * @summary Renders the Suggestion component.
	 *
	 * @returns {JSX.Element} Rendered Component.
	 */
	render() {
		const buttonProps = {};

		if ( this.props.button.type === "primary" ) {
			buttonProps.className = "yoast-button yoast-button--primary";
		}

		return (
			<div className="yoast-wizard--list yoast-wizard--columns yoast-wizard--suggestion">
				<div className="yoast-wizard--column__push_right">
					<h2 className="yoast-h2">{ this.props.title }</h2>
					<p>{ this.props.copy }</p>
					<a href={ this.props.button.href } target="_blank" className="yoast-button yoast-button--secondary" { ...buttonProps }>
						{ this.props.button.label }
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
