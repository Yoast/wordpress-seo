import { Alert } from "@yoast/components";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

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
		  window.wpseoApi.post( "alerts/dismiss", { key: "video-metabox-reactification-alert" }, response => {
				if ( ! response || ! response.success ) {
					return;
				}

				// Update the store when succesfully dismissed.
				props.dismissAlert( "video-metabox-reactification-alert" );
		  } );
		},
		[ props.dismissAlert ]
	);

	if ( props.reactAlertIsDismissed ) {
		return null;
	}
	return <Alert
		type="info"
		onDismissed={ dismissAlert }
	>
		{ __( "We've made some changes to Yoast SEO Video.", "yoast-video-seo" ) + " " }
		<a
			href="https://yoa.st/video-changes"
			target="_blank"
			rel="noopener noreferrer"
		>
			{ __( "Learn more about what has changed.", "yoast-video-seo" ) }
		</a>
	</Alert>;
}

PersistentDismissableAlert.propTypes = {
	children: PropTypes.string.isRequired,
	display: PropTypes.bool,
	id: PropTypes.string.isRequired,
};

PersistentDismissableAlert.defaultProps = {
	display: true,
};
