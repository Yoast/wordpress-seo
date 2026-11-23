import React from "react";
import { __ } from "@wordpress/i18n";

/**
 * Function for the NewBadge component.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.inLabel=false] Whether the NewBadge is displayed close to a Label.
 *
 * @returns {React.Component} The NewBadge.
 */
const NewBadge = ( { inLabel = false } ) => (
	<span className={ inLabel ? "yoast-badge yoast-badge__in-label yoast-new-badge" : "yoast-badge yoast-new-badge" }>
		{ __( "New", "wordpress-seo" ) }
	</span>
);

export default NewBadge;
