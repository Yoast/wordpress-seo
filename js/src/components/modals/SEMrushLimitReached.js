/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const UpdateSEMrushPlanLink = makeOutboundLink();

/**
 * Creates the content for the SEMrush limit exceeded modal.
 *
 * @returns {wp.Element} The SEMrush limit exceeded modal content.
 */
const SEMrushLimitReached = () => {
	return (
		<Fragment>
			<p>
				{
					sprintf(
						/* translators: %s : Expands to "SEMrush". */
						__( "You've reached your request limit for today. Check back tomorrow or upgrade your plan over at %s.", "wordpress-seo" ),
						"SEMrush"
					)
				}
			</p>
			<UpdateSEMrushPlanLink
				href={ window.wpseoAdminL10n[ "shortlinks.semrush.prices" ] }
				className="yoast-button-upsell"
			>
				{
					sprintf(
						/* translators: %s : Expands to "SEMrush". */
						__( "Upgrade your %s plan", "wordpress-seo" ),
						"SEMrush"
					)
				}
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</UpdateSEMrushPlanLink>
		</Fragment>
	);
};

export default SEMrushLimitReached;
