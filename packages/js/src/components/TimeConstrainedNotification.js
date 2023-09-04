import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { select } from "@wordpress/data";
import PersistentDismissableNotification from "../containers/PersistentDismissableNotification";
import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";

/**
 * @param {string}      store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {string}      title The title of the notification.
 * @param {string}      promoId The promotion id.
 * @param {JSX.node}    children The content of the notification.
 *
 * @returns {JSX.Element} The TimeConstrainedNotification component.
 */
export const TimeConstrainedNotification = ( {
	store = "yoast-seo/editor",
	image: Image = DefaultImage,
	promoId,
	title,
	children,
	...props
} ) => {
	const promotionActive = select( store ).isPromotionActive( promoId );
	return (
		promotionActive && <PersistentDismissableNotification
			alertKey={ promoId }
			store={ store }
			id="time-constrained-notification"
			title={ title }
			image={ Image }
			{ ...props }
		>
			{ children }
		</PersistentDismissableNotification>
	);
};

TimeConstrainedNotification.propTypes = {
	store: PropTypes.string,
	image: PropTypes.elementType,
	promoId: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.node,
};
