import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";

/**
 * Display the message when reaching max related keyphrases.
 *
 * @param {string} [className=""] The class name for the alert.
 *
 * @returns {React.Component} The alert for max related keyphrases.
 */
export const MaxRelatedKeyphrases = ( { className = "" } ) => {
	return (
		<Alert variant="warning" className={ className }>
			{ sprintf(
				/* translators: %s: Expands to "Yoast SEO". */
				__(
					"You've reached the maximum amount of 4 related keyphrases. You can change or remove related keyphrases in the %s metabox or sidebar.",
					"wordpress-seo",
				),
				"Yoast SEO",
			) }
		</Alert>
	);
};

MaxRelatedKeyphrases.propTypes = {
	className: PropTypes.string,
};
