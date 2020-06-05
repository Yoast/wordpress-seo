import React from "react";

/**
 * The Country selector component.
 */
class CountrySelector extends React.Component {
	/**
	 * Constructs the country selector.
	 *
	 * @param {Object}   props                                   The props for the country selector.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the country selector.
	 *
	 * @returns {ReactElement} The snippet country selector.
	 */
	render() {
		return (
			<div>
				<h1> Country selector </h1>
				<p> The Country selector will come here ! </p>
			</div>
		);
	}
}

CountrySelector.propTypes = {

};

CountrySelector.defaultProps = {

};

export default CountrySelector;
