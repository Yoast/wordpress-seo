import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/**
 * Function for the NewBadge component.
 *
 * @param {bool} inLabel Whether the NewBadge is within a Label.
 *
 * @returns {React.Component} The NewBadge.
 */
const NewBadge = ( { inLabel } ) => (
	<span className={ inLabel ? "yoast-badge yoast-badge__in-label yoast-new-badge" : "yoast-badge yoast-new-badge" }>
		{ __( "New", "wordpress-seo" ) }
	</span>
);

NewBadge.propTypes = {
	inLabel: PropTypes.bool,
};

NewBadge.defaultProps = {
	inLabel: false,
};

export default NewBadge;
