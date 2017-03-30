import React from "react";

import Suggestion from "./Suggestion";

class Suggestions extends React.Component {
	/**
	 * @summary Renders the Suggestions component.
	 *
	 * @returns {JSX.Element} Rendered Choices Component.
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

Suggestions.PropTypes = {
	properties: React.PropTypes.array.isRequired,
};
