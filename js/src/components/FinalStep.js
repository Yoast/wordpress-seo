import React from "react";

/**
 * @summary Mailchimp signup component.
 */
class FinalStep extends React.Component {

	/**
	 *
	 * @returns {JSX.Element} A HTML paragraph element containing the Final Step response.
	 */
	render() {
		return (
			<div className="yoast-wizard-columns">
				<div className="yoast-wizard-column__push_right">
					<h2 className="yoast-wizard--heading">{this.props.properties.title}</h2>
					<p>{this.props.properties.message}</p>
				</div>
				<div className="yoast-wizard-column__push_left yoast-wizard--video-frame">
					<iframe width="560" height="315" src={this.props.properties.video.url}
					        title={this.props.properties.video.title} frameborder="0" allowfullscreen></iframe>
				</div>
			</div>
		);
	}
}

export default FinalStep;
