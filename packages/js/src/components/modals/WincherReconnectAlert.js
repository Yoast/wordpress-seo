import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { Alert } from "@yoast/components";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * Creates the content for the Wincher reconnect alert.
 *
 * @param {function}  onReconnect Callback to trigger reconnect.
 * @param {string} [className=""] Optional className for the alert.
 *
 * @returns {JSX.Element} The Wincher reconnect alert.
 */
const WincherReconnectAlert = ( { onReconnect, className = "" } ) => {
	const message = sprintf(
		/* translators: %s expands to a link to open the Wincher login popup. */
		__(
			"It seems like something went wrong when retrieving your website's data. Please %s and try again.",
			"wordpress-seo"
		),
		"<reconnectToWincher/>",
		"Wincher"
	);

	return (
		<Alert type="error" className={ className }>
			{
				safeCreateInterpolateElement( message, {
					// eslint-disable-next-line jsx-a11y/anchor-is-valid
					reconnectToWincher: <a
						href="#" onClick={ e => { // eslint-disable-line react/jsx-no-bind
							e.preventDefault();
							onReconnect();
						} }
					>
						{
							sprintf(
								/* translators: %s : Expands to "Wincher". */
								__( "reconnect to %s", "wordpress-seo" ),
								"Wincher"
							)
						}
					</a>,
				} )
			}
		</Alert>
	);
};

WincherReconnectAlert.propTypes = {
	onReconnect: PropTypes.func.isRequired,
	className: PropTypes.string,
};

export default WincherReconnectAlert;
