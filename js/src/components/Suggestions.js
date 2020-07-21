import { Component } from "@wordpress/element";
import PropTypes from "prop-types";

import Suggestion from "./Suggestion";

/**
 * @summary Suggestions component for config wizard.
 */
class Suggestions extends Component {
	/**
	 * @summary Renders the Suggestions component.
	 *
	 * @returns {wp.Element} Rendered Choices Component.
	 */
	render() {
		return (
			<div>
				{
					this.props.properties.suggestions.map( function( suggestion, key ) {
						return <Suggestion key={ key } { ...suggestion } />;
					} )
				}
			</div>
		);
	}
}

export default Suggestions;

Suggestions.propTypes = {
	properties: PropTypes.object.isRequired,
};
