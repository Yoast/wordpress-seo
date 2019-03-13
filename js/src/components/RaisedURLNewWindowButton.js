// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import InfoIcon from "material-ui/svg-icons/action/info";
import { utils } from "yoast-components";

// Internal dependencies.
import RaisedDefaultButton from "./RaisedDefaultButton";

const { makeOutboundLink } = utils;

/**
 * Creates the Raised URL Button which opens in a new window.
 *
 * @param {Object} props Props passed to this element.
 * @returns {JSX.Element} Rendered RaisedURLNewWindowButton Element.
 * @constructor
 */
const RaisedURLNewWindowButton = ( props ) => {
	return (
		// Remove aria-label to make the OutboundLink a11y message be announced.
		<RaisedDefaultButton aria-label={ null } { ...props } />
	);
};

const RaisedURLNewWindowLink = makeOutboundLink( RaisedURLNewWindowButton );

RaisedURLNewWindowButton.propTypes = {
	href: PropTypes.string.isRequired,
	icon: PropTypes.object,
};

RaisedURLNewWindowButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28" />,
};

export default RaisedURLNewWindowLink;
