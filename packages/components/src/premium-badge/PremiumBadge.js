import React from "react";

/**
 * Function for the PremiumBadge component.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.inLabel=false] Whether the PremiumBadge is displayed close to a Label.
 *
 * @returns {React.Component} The PremiumBadge.
 */
const PremiumBadge = ( { inLabel = false } ) => (
	<span className={ inLabel ? "yoast-badge yoast-badge__in-label yoast-premium-badge" : "yoast-badge yoast-premium-badge" }>
		{ /* We don't want this string to be translatable. */ }
		Premium
	</span>
);

export default PremiumBadge;
