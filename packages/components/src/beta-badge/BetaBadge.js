import React from "react";
import { __ } from "@wordpress/i18n";

/**
 * Function for the BetaBadge component.
 *
 * @returns {React.Component} The BetaBadge.
 */
const BetaBadge = () => (
	<span className={ "yoast-badge yoast-beta-badge" }>
		{ __( "Beta", "wordpress-seo" ) }
	</span>
);

export default BetaBadge;
