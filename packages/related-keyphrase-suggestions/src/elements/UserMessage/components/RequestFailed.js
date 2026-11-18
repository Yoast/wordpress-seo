import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";

/**
 * Display the message for a failed request.
 *
 * @param {string} [className=""] The class name for the alert.
 *
 * @returns {React.Component} The message for a failed request.
 */
export const RequestFailed = ( { className = "" } ) => {
	return (
		<Alert variant="error" className={ className }>
			{ __( "We've encountered a problem trying to get related keyphrases. Please try again later.", "wordpress-seo" ) }
		</Alert>
	);
};

RequestFailed.propTypes = {
	className: PropTypes.string,
};
