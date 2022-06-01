import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";

import PersistentDismissableAlert from "../containers/PersistentDismissableAlert";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 *
 * @returns {JSX.Element} The WebinarPromoAlert component.
 */
const WebinarPromoAlert = ( { store = "yoast-seo/editor" } ) => {
	const isPremium = useSelect( select => select( store ).getIsPremium() );

	return isPremium ? null : (
		<PersistentDismissableAlert alertKey="webinar-promo-alert" type="info" store={ store }>
			{ __( "Curious what Yoast SEO Premium can do for you? Join one of our upcoming webinars and our SEO experts will tell you all about it!", "wordpress-seo" ) }
			<br />
			<a href="https://yoast.com/" target="_blank" rel="noreferrer">
				{ __( "Read more", "wordpress-seo" ) }
			</a>
		</PersistentDismissableAlert>
	);
};

WebinarPromoAlert.propTypes = {
	store: PropTypes.string,
};

export default WebinarPromoAlert;
