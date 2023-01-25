import React from "react";
import PropTypes from "prop-types";

/**
 * Function for the PremiumBadge component.
 *
 * @param {bool} inLabel Whether the PremiumBadge is displayed close to a Label.
 *
 * @returns {React.Component} The PremiumBadge.
 */
const PremiumBadge = ( { inLabel } ) => (
	<span className={ inLabel ? "yoast-badge yoast-badge__in-label yoast-premium-badge" : "yoast-badge yoast-premium-badge" }>
		{ /* We don't want this string to be translatable. */ }
		Premium
	</span>
);

PremiumBadge.propTypes = {
	inLabel: PropTypes.bool,
};

PremiumBadge.defaultProps = {
	inLabel: false,
};

export default PremiumBadge;
