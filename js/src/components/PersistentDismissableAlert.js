import { Alert } from "@yoast/components";
import { useCallback, PropTypes } from "@wordpress/element";

/**
 * Renders the PersistentDismissableAlert component.
 *
 * @param {Object} props The props for the PersistentDismissableAlert.
 *
 * @returns {ReactElement} The PersistentDismissableAlert component.
 */
export default function PersistentDismissableAlert( props ) {
	const dismissAlert = useCallback(
		() => {
			// Calling the REST route here.
			window.wpseoApi.post( "alerts/dismiss", { key: props.key }, response => {
				if ( ! response || ! response.success ) {
					return;
				}

				// Update the store when succesfully dismissed.
				props.dismissAlert( props.key );
			} );
		},
		[ props.dismissAlert ]
	);

	if ( props.dismissed ) {
		return null;
	}
	return <Alert
		type={ props.type }
		onDismissed={ dismissAlert }
	>
		{ props.children }
	</Alert>;
}

PersistentDismissableAlert.propTypes = {
	children: PropTypes.string.isRequired,
	dismissed: PropTypes.bool,
	key: PropTypes.string.isRequired,
	type: PropTypes.string,
};

PersistentDismissableAlert.defaultProps = {
	dismissed: true,
	type: "info",
};
