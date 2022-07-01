import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/**
 * Function for the BetaBadge component.
 *
 * @param {bool} inLabel Whether the BetaBadge is displayed close to a Label.
 *
 * @returns {React.Component} The BetaBadge.
 */
const BetaBadge = ( { inLabel } ) => (
	<span className={ inLabel ? "yoast-badge yoast-badge__in-label yoast-beta-badge" : "yoast-badge yoast-beta-badge" }>
		{ __( "Beta", "wordpress-seo" ) }
	</span>
);

BetaBadge.propTypes = {
	inLabel: PropTypes.bool,
};

BetaBadge.defaultProps = {
	inLabel: false,
};

export default BetaBadge;
