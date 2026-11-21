import {
	PingOtherAdminsAlertItem,
	DefaultAlertItem,
} from "../alert-items";

/**
 * The appropriate alert content component based on the alert ID.
 *
 * @param {Object} props Component props.
 * @param {string} props.id Alert ID.
 * @param {boolean} props.dismissed Whether the alert is dismissed.
 * @param {string} props.message Alert message.
 * @param {string} props.resolveNonce Nonce to resolve the alert.
 *
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
