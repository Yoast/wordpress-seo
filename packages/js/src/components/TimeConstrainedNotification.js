import { select } from "@wordpress/data";
import PropTypes from "prop-types";
import ConnectedPersistentDismissableNotification from "../containers/PersistentDismissableNotification";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {Object|string} title The title of the notification.
 * @param {string} promoId The promotion id.
 * @param {string} alertKey The unique id for the alert.
 * @param {React.ReactNode} [children=null] The content of the notification.
 *
 * @returns {JSX.Element} The TimeConstrainedNotification component.
 */
export const TimeConstrainedNotification = ( {
	store = "yoast-seo/editor",
	image: Image = null,
	title,
	promoId,
	alertKey,
	children = null,
	...props
} ) => {
	const promotionActive = select( store ).isPromotionActive( promoId );

	return (
		promotionActive && <ConnectedPersistentDismissableNotification
			alertKey={ alertKey }
			store={ store }
			id={ alertKey }
			title={ title }
			image={ Image }
			{ ...props }
		>
			{ children }
		</ConnectedPersistentDismissableNotification>
	);
};

TimeConstrainedNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	title: PropTypes.any.isRequired,
	promoId: PropTypes.string.isRequired,
	alertKey: PropTypes.string.isRequired,
	children: PropTypes.node,
};
