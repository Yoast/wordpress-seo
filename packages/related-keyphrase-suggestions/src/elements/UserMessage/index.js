import PropTypes from "prop-types";
import React from "react";
import { MaxRelatedKeyphrases, RequestEmpty, RequestFailed, RequestLimitReached } from "./components";

/**
 * Displays the user message following a request or action.
 *
 * @param {?string} [variant=null] The type of message to display.
 * @param {string} [upsellLink=""] The link to the upsell page.
 * @param {string} [className=""] The class name for the button.
 *
 * @returns {JSX.Element} The user message.
 */
export const UserMessage = ( { variant = null, upsellLink = "", className = "" } ) => {
	switch ( variant ) {
		case "requestLimitReached":
			return <RequestLimitReached upsellLink={ upsellLink } className={ className } />;
		case "requestFailed":
			return <RequestFailed className={ className } />;
		case "requestEmpty":
			return <RequestEmpty className={ className } />;
		case "maxRelatedKeyphrases":
			return <MaxRelatedKeyphrases className={ className } />;
		default:
			return null;
	}
};

UserMessage.propTypes = {
	variant: PropTypes.oneOf( [ "requestLimitReached", "requestFailed", "requestEmpty", "maxRelatedKeyphrases" ] ),
	upsellLink: PropTypes.string,
	className: PropTypes.string,
};
