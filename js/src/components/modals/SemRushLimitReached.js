/* External dependencies */
import React from "react";
import { makeOutboundLink } from "@yoast/helpers";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

const UpdateSemRushPlanLink = makeOutboundLink();

/**
 * Creates the content for the SEMrush limit exceeded modal.
 *
 * @returns {ReactElement} The SEMrush limit exceeded modal content.
 */
const SemRushLimitReached = () => {
	return (
		<Fragment>
			<p>
				{
					sprintf(
						/* translators: %s : Expands to "SEMrush". */
						__( "You've reached your request limit for today. Check back tomorrow or upgrade your plan over at %s", "wordpress-seo" ),
						"SEMrush"
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
						"SEMrush"
					)
				}
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</UpdateSemRushPlanLink>
		</Fragment>
	);
};

export default SemRushLimitReached;
