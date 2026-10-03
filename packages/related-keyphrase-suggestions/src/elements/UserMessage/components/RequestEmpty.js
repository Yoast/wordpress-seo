import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";

/**
 * Display the message for a empty request.
 *
 * @param {string} [className=""] The class name for the alert.
 *
 * @returns {React.Component} The message for a empty request.
 */
export const RequestEmpty = ( { className = "" } ) => {
	return (
		<Alert variant="info" className={ className }>
			{ __( "Sorry, there's no data available for that keyphrase/country combination.", "wordpress-seo" ) }
		</Alert>
	);
};

RequestEmpty.propTypes = {
	className: PropTypes.string,
};
