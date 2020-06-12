/* External dependencies */
import React from "react";
import { makeOutboundLink } from "@yoast/helpers";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

const UpdateSemRushPlanLink = makeOutboundLink();

/**
 * Creates the content for the SEMRush limit exceeded modal.
 *
 * @returns {React.Element} The SEMRush limit exceeded modal content.
 */
const SemRushLimitReached = () => {
	return (
		<Fragment>
			<p>
				{
					sprintf(
						/* translators: %s : Expands to "SEMrush". */
						__( "You've reached your request limit for today. Check back tomorrow or upgrade your plan over at %s", "wordpress-seo" ),
						"SEMRush"
					)
				}
			</p>
			<UpdateSemRushPlanLink
				href="https://yoa.st/semrush-prices"
				className="yoast-button-upsell"
			>
				{
					sprintf(
						/* translators: %s : Expands to "SEMrush". */
						__( "Upgrade your %s plan", "wordpress-seo" ),
						"SEMRush"
					)
				}
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</UpdateSemRushPlanLink>
		</Fragment>
	);
};

export default SemRushLimitReached;
