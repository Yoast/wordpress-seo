/* External dependencies */
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher reconnect alert.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The Wincher reconnect alert.
 */
const WincherReconnectAlert = ( props ) => {
	const message = sprintf(
		/* translators: %s expands to a link to open the Wincher login popup. */
		__(
			"It seems like something went wrong when retrieving your website's data. Please %s and try again.",
			"wordpress-seo"
		),
		"{{reconnectToWincher/}}",
		"Wincher"
	);

	return (
		<Alert type="error">
			{
				interpolateComponents( {
					mixedString: message,
					components: {
						// eslint-disable-next-line jsx-a11y/anchor-is-valid
						reconnectToWincher: <a
							href="#" onClick={ e => { // eslint-disable-line react/jsx-no-bind
								e.preventDefault();
								props.onReconnect();
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
					},
				} )
			}
		</Alert>
	);
};

WincherReconnectAlert.propTypes = {
	onReconnect: PropTypes.func.isRequired,
};

export default WincherReconnectAlert;
