import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";

import ConnectedPersistentDismissableNotification from "../containers/PersistentDismissableNotification";
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
		<ConnectedPersistentDismissableNotification
			alertKey="webinar-promo-notification"
			store={ store }
			id="webinar-promo-notification"
			title={ __( "Ready to boost your online visibility?", "wordpress-seo" ) }
			image={ Image }
			url={ url }
			{ ...props }
		>
			{ safeCreateInterpolateElement(
				sprintf(
					/* translators: 1: bold open tag; 2: "FREE"; 3: bold close tag; 4: "Yoast SEO". */
					__( "Access our %1$s%2$s%3$s webinars and podcasts to get started with %4$s and build the foundational skills and confidence needed for sustainable success.", "wordpress-seo" ),
					"<strong>",
					"FREE",
					"</strong>",
					"Yoast SEO"
				), {
					strong: <strong />,
				}
			) }
			&nbsp;<a href={ url } target="_blank" rel="noreferrer">
				{ __( "Sign up today!", "wordpress-seo" ) }
			</a>
		</ConnectedPersistentDismissableNotification>
	);
};

WebinarPromoNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	url: PropTypes.string.isRequired,
};

export default WebinarPromoNotification;
