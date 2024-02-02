import { __ } from "@wordpress/i18n";
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
			title={ __( "Join our FREE webinar for SEO success", "wordpress-seo" ) }
			image={ Image }
			url={ url }
			{ ...props }
		>
			{ __( "Feeling lost when it comes to optimizing your site for the search engines? Join our FREE webinar to gain the confidence that you need in order to start optimizing like a pro! You'll obtain the knowledge and tools to start effectively implementing SEO.", "wordpress-seo" ) }
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
