import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { LockOpenIcon } from "@heroicons/react/outline";

/**
 * The premium upsell component.
 *
 * @param {string} url The URL to the premium page.
 * @param {string} [className] The class name for the component.
 *
 * @returns {JSX.Element} The premium upsell component.
 */
export const PremiumUpsell = ( { url, className } ) => {
	return <div className={ className }>
		<p>
			{ sprintf(
				/* translators: %s: Expands to "Yoast SEO". */
				__(
					"You’ll reach more people with multiple keyphrases! Want to quickly add these related keyphrases to the %s analyses for even better content optimization?",
					"wordpress-seo",
				),
				"Yoast SEO",
			) }
		</p>
		<Button
			variant="upsell"
			as="a" href={ url }
			className="yst-mt-4 yst-gap-2"
			target="_blank"
		>
			<LockOpenIcon className="yst-w-4 yst-h-4 yst-text-amber-900" />
			{ sprintf(
				/* translators: %s: Expands to "Yoast SEO Premium". */
				__( "Explore %s!", "wordpress-seo" ),
				"Yoast SEO Premium",
			)
			}
			<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
		</Button>

	</div>;
};

PremiumUpsell.propTypes = {
	url: PropTypes.string.isRequired,
	className: PropTypes.string,
};
