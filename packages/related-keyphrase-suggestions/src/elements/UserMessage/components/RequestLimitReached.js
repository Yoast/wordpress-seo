import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button } from "@yoast/ui-library";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

/**
 * Display the message for a request that has reached the limit.
 *
 * @param {String} [upsellLink] The upsell link.
 * @param {string} [className=""] The class name for the alert.
 *
 * @returns {React.Component} The message for limit reached.
 */
export const RequestLimitReached = ( { upsellLink, className = "" } ) => {
	return (
		<Alert variant="warning" className={ className }>
			<div className="yst-flex yst-flex-col yst-items-start">
				{ sprintf(
					/* translators: %s : Expands to "Semrush". */
					__( "You've reached your request limit for today. Check back tomorrow or upgrade your plan over at %s.", "wordpress-seo" ),
					"Semrush",
				) }

				{ upsellLink && <Button
					variant="upsell"
					className="yst-mt-3 yst-gap-1.5"
					as="a"
					href={ upsellLink }
					target="_blank"
				>
					{
						sprintf(
						/* translators: %s : Expands to "Semrush". */
							__( "Upgrade your %s plan", "wordpress-seo" ),
							"Semrush",
						)
					}
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-text-amber-900 rtl:yst-rotate-180" />

				</Button> }
			</div>
		</Alert>
	);
};

RequestLimitReached.propTypes = {
	upsellLink: PropTypes.string,
	className: PropTypes.string,
};
