import { Component } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * @summary Final step in the wizard component.
 */
class FinalStep extends Component {
	/**
	 * Renders the video next to the final congratulation message for completing the wizard
	 *
	 * @returns {wp.Element} A HTML paragraph element containing the Final Step response.
	 */
	render() {
		return (
			<div className="yoast-wizard--columns">
				<div className="yoast-wizard--column__push_right">
					<h2 className="yoast-wizard--heading">{ this.props.properties.title }</h2>
					<p>{ this.props.properties.message }</p>
				</div>
				<div className="yoast-wizard--column__push_left">
					{ /* eslint-disable-next-line react/jsx-no-target-blank */ }
					<a href={ this.props.properties.href } target="_blank" id="plugin-training-image-link">
						<img
							width="100%" height="100%" src={ this.props.properties.image.src } alt={ this.props.properties.image.alt }
						/>
					</a>
				</div>
			</div>
		);
	}
}

FinalStep.propTypes = {
	properties: PropTypes.object.isRequired,
};

export default FinalStep;
