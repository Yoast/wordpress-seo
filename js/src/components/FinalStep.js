import React from "react";

/**
 * @summary Final step in the wizard component.
 */
class FinalStep extends React.Component {

	/**
	 * Renders the video next to the final congratulation message for completing the wizard
	 *
	 * @returns {JSX.Element} A HTML paragraph element containing the Final Step response.
	 */
	render() {
		return (
			<div className="yoast-wizard--columns">
				<div className="yoast-wizard--column__push_right">
					<h2 className="yoast-wizard--heading">{ this.props.properties.title }</h2>
					<p>{ this.props.properties.message }</p>
				</div>
				<div className="yoast-wizard--column__push_left yoast-wizard--video-frame">
					<iframe width="400" height="225" src={ this.props.properties.video.url }
					        title={ this.props.properties.video.title } frameBorder="0" allowFullScreen/>
				</div>
			</div>
		);
	}
}

export default FinalStep;
