import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {string} url The URL for the register now link.
 *
 * @returns {JSX.Element} The TimeConstrainedNotification component.
 */
export const TimeConstrainedNotification = ( {
	store = "yoast-seo/editor",
	url,
	...props
} ) => {
	return (
		<PersistentDismissableNotification
			alertKey="time-constrained-notification"
			store={ store }
			id="time-constrained-notification"
			title={ __( "Is your WooCommerce store ready for Black Friday?", "wordpress-seo" ) }
			url={ url }
			{ ...props }
		>
			{ __( "Get help with maximizing your upcoming Black Friday sales! This ultimate Black Friday checklist helps you prepare for Black Friday and boost your sales. Get the checklist now!", "wordpress-seo" ) }
			&nbsp;<a href={ url } target="_blank" rel="noreferrer">
				{ __( "Get the checklist now!", "wordpress-seo" ) }
			</a>
		</PersistentDismissableNotification>
	);
};

TimeConstrainedNotification.propTypes = {
	store: PropTypes.string,
	url: PropTypes.string.isRequired,
};
