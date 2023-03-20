import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";

import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";
import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {string} url The URL for the register now link.
 *
 * @returns {JSX.Element} The WebinarPromoNotification component.
 */
const WebinarPromoNotification = ( {
	store = "yoast-seo/editor",
	image: Image = DefaultImage,
	url,
	...props
} ) => {
	const isPremium = useSelect( select => select( store ).getIsPremium() );

	return isPremium ? null : (
		<PersistentDismissableNotification
			alertKey="webinar-promo-notification"
			store={ store }
			id="webinar-promo-notification"
			title={ sprintf(
				/* translators: 1: Yoast SEO. */
				__( "Get the most out of %1$s", "wordpress-seo" ),
				"Yoast SEO"
			) }
			image={ Image }
			url={ url }
			{ ...props }
		>
			{ sprintf(
				/* translators: 1: Yoast SEO. */
				__( "Learn how to improve your rankings with %1$s. Ask your questions to our SEO experts during the free live Q&A.", "wordpress-seo" ),
				"Yoast SEO"
			) }
			&nbsp;<a href={ url } target="_blank" rel="noreferrer">
				{ __( "Register now!", "wordpress-seo" ) }
			</a>
		</PersistentDismissableNotification>
	);
};

WebinarPromoNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	url: PropTypes.string.isRequired,
};

export default WebinarPromoNotification;
