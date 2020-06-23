/* External dependencies */
import React from "react";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert } from "@yoast/components";

/**
 * Creates the content for the SEMrush request failed modal.
 *
 * @returns {React.Element} The SEMrush request failed modal content.
 */
const SemRushRequestFailed = () => {
	return (
		<p>
			<Alert type="error">
				{ __(
					"We've encountered a problem trying to get related keyphrases. Please try again later.",
					"wordpress-seo"
				) }
			</Alert>
		</p>
	);
};

export default SemRushRequestFailed;
