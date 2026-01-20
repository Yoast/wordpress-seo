/* global wpseoAdminGlobalL10n */
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/components";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { makeOutboundLink } from "@yoast/helpers";

const UpdateWincherPlanLink = makeOutboundLink();

/**
 * Creates the content for the Wincher limit exceeded modal.
 *
 * @param {number} [limit=10] The allowed keyphrase limit.
 *
 * @returns {JSX.Element} The Wincher limit exceeded modal content.
 */
const WincherLimitReached = ( { limit = 10 } ) => {
	const message = sprintf(
		/* translators: %1$d expands to the amount of allowed keyphrases on a free account, %2$s expands to a link to Wincher plans. */
		__(
			"You've reached the maximum amount of %1$d keyphrases you can add to your Wincher account. If you wish to add more keyphrases, please %2$s.",
			"wordpress-seo"
		),
		limit,
		"<UpdateWincherPlanLink/>"
	);

	return (
		<Alert type="error">
			{
				safeCreateInterpolateElement( message, {
					UpdateWincherPlanLink: <UpdateWincherPlanLink href={ wpseoAdminGlobalL10n[ "links.wincher.pricing" ] }>
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

export default WincherLimitReached;
