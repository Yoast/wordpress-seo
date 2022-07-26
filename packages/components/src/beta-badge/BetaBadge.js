import React from "react";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * A component for adding a badge to a beta feature.
 *
 * @param {Object} props            The props.
 * @param {String} props.className  The class name.
 *
 * @returns {React.Component} The BetaBadge.
 */
const BetaBadge = ( props ) => (
	<span className={ `yoast-badge ${ props.className }` }>
		{ __( "Beta", "wordpress-seo" ) }
	</span>
);

BetaBadge.propTypes = {
	className: PropTypes.string,
};

BetaBadge.defaultProps = {
	className: "yoast-beta-badge",
};

export default BetaBadge;
