/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";

/**
 * The Country selector component.
 */
class CountrySelector extends React.Component {
	/**
	 * Constructs the country selector.
	 *
	 * @param {Object} props The props for the country selector.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the country selector.
	 *
	 * @returns {React.Element} The country selector.
	 */
	render() {
		// This `fakeProp` within the h2 is temporary in this component first basic implementation and should be removed.
		return (
			<Fragment>
				<h2 id={ this.props.fakeProp }>Country selector</h2>
				<p>The Country selector will come here!</p>
			</Fragment>
		);
	}
}

CountrySelector.propTypes = {
	fakeProp: PropTypes.string,
};

CountrySelector.defaultProps = {
	fakeProp: null,
};

export default CountrySelector;
