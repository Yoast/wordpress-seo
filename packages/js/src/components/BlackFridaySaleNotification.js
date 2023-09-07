import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";

import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {string} url The URL for the register now link.
 *
 * @returns {JSX.Element} The BlackFridaySaleNotification component.
 */
const BlackFridaySaleNotification = ( {
	store = "yoast-seo/editor",
	url,
	...props
} ) => {
	const isPremium = useSelect( select => select( store ).getIsPremium() );

	return isPremium ? null : (
		<PersistentDismissableNotification
			alertKey="black-friday-sale-notification"
			store={ store }
			id="black-friday-sale-notification"
			title={ __( "BLACK FRIDAY SALE: YOAST SEO PREMIUM", "wordpress-seo" ) }
			image={ Image }
			url={ url }
			{ ...props }
		>
			<span className="yoast-bf-sale-badge">30% OFF!</span>
			<a href={ url } target="_blank" rel="noreferrer">
				{ __( "Buy now!", "wordpress-seo" ) }
			</a>
		</PersistentDismissableNotification>
	);
};

BlackFridaySaleNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	url: PropTypes.string.isRequired,
};

export default BlackFridaySaleNotification;
