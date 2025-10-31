import PropTypes from "prop-types";
import {
	PingOtherAdminsAlertItem,
	DefaultAlertItem,
} from "../alert-items";

/**
 * The appropriate alert content component based on the alert ID.
 *
 * @param {string} id Alert ID.
 * @param {boolean} dismissed Whether the alert is dismissed.
 * @param {string} message Alert message.
 * @param {string} resolveNonce Nonce to resolve the alert.
 * @returns {JSX.Element} The AlertContent component.
 */
export const AlertContent = ( { id, dismissed, message, resolveNonce } ) => {
	switch ( id ) {
		case "wpseo-ping-other-admins":
			return <PingOtherAdminsAlertItem
				id={ id }
				dismissed={ dismissed }
				message={ message }
				resolveNonce={ resolveNonce }
			/>;
		default:
			return <DefaultAlertItem
				dismissed={ dismissed }
				message={ message }
			/>;
	}
};

AlertContent.propTypes = {
	id: PropTypes.string.isRequired,
	dismissed: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	resolveNonce: PropTypes.string.isRequired,
};
