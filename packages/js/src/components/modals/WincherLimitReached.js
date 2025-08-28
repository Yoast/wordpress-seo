/* global wpseoAdminGlobalL10n */

/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";
import { Alert } from "@yoast/components";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

const UpdateWincherPlanLink = makeOutboundLink();

/**
 * Creates the content for the Wincher limit exceeded modal.
 *
 * @param {Object} props The props to use for this component.
 *
 * @returns {wp.Element} The Wincher limit exceeded modal content.
 */
const WincherLimitReached = ( props ) => {
	const message = sprintf(
		/* translators: %1$d expands to the amount of allowed keyphrases on a free account, %2$s expands to a link to Wincher plans. */
		__(
			"You've reached the maximum amount of %1$d keyphrases you can add to your Wincher account. If you wish to add more keyphrases, please %2$s.",
			"wordpress-seo"
		),
		props.limit,
		"<updateWincherPlanLink/>"
	);

	return (
		<Alert type="error">
			{
				safeCreateInterpolateElement( message, {
					updateWincherPlanLink: <UpdateWincherPlanLink href={ wpseoAdminGlobalL10n[ "links.wincher.pricing" ] }>
						{
							sprintf(
								/* translators: %s : Expands to "Wincher". */
								__( "upgrade your %s plan", "wordpress-seo" ),
								"Wincher"
							)
						}
					</UpdateWincherPlanLink>,
				} )
			}
		</Alert>
	);
};

WincherLimitReached.propTypes = {
	limit: PropTypes.number,
};

WincherLimitReached.defaultProps = {
	limit: 10,
};

export default WincherLimitReached;
