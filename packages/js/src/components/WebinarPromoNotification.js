import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";

import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";
import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 *
 * @returns {JSX.Element} The WebinarPromoNotification component.
 */
const WebinarPromoNotification = ( {
	store = "yoast-seo/editor",
	image: Image = DefaultImage,
} ) => {
	const isPremium = useSelect( select => select( store ).getIsPremium() );

	return isPremium ? null : (
		<PersistentDismissableNotification
			alertKey="webinar-promo-notification"
			store={ store }
			id="webinar-promo-notification"
			title={ __( "Get the most out of Yoast SEO", "wordpress-seo" ) }
			image={ Image }
		>
			{ __( "Want to optimize even further with the help of our SEO experts? Sign up for our weekly webinar!", "wordpress-seo" ) }
			<br />
			<a href="https://yoast.com/" target="_blank" rel="noreferrer">
				{ __( "Register now!", "wordpress-seo" ) }
			</a>
		</PersistentDismissableNotification>
	);
};

WebinarPromoNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
};

export default WebinarPromoNotification;
