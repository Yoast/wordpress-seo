import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";
import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {string} url The URL for the register now link.
 *
 * @returns {JSX.Element} The BlackFridayPromoNotification component.
 */
const BlackFridayPromoNotification = ( {
	store = "yoast-seo/editor",
	image: Image = DefaultImage,
	url,
	...props
} ) => {
	return (
		<PersistentDismissableNotification
			alertKey="black-friday-promo-notification"
			store={ store }
			id="black-friday-promo-notification"
			title={ __( "Is your WooCommerce store ready for Black Friday?", "wordpress-seo" ) }
			image={ Image }
			url={ url }
			{ ...props }
		>
			{ __( "Get help with maximizing your upcoming Black Friday sales! The ultimate Black Friday checklist helps you prepare for Black Friday and boost your sales.", "wordpress-seo" ) }
			&nbsp;<a href={ url } target="_blank" rel="noreferrer">
				{ __( "Get the checklist now!", "wordpress-seo" ) }
			</a>
		</PersistentDismissableNotification>
	);
};

BlackFridayPromoNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	url: PropTypes.string.isRequired,
};

export default BlackFridayPromoNotification;
