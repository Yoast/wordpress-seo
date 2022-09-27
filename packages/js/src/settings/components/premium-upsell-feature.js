import { LockOpenIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

/**
 * @param {string} [variant] The variant. See propTypes.
 * @param {JSX.node} children The children.
 * @param {string} [premiumLink] The URL to link to. Required if variant is card.
 * @returns {JSX.Element} The feature or the upsell around the feature.
 */
const PremiumUpsellFeature = ( { variant = "default", children, premiumLink = "" } ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const svgAriaProps = useSvgAria();

	if ( isPremium ) {
		return children;
	}

	if ( variant === "card" ) {
		return (
			<div className="yst-relative yst-p-6">
				<div className="yst-space-y-8 yst-grayscale">
					{ children }
				</div>
				<div className="yst-absolute yst-inset-0 yst-z-10 yst-bg-white yst-bg-opacity-50 yst-ring-1 yst-ring-black yst-ring-opacity-5 yst-shadow-lg yst-rounded-md" />
				<div className="yst-absolute yst-inset-0 yst-z-20 yst-flex yst-items-center yst-justify-center">
					<Button as="a" className="yst-gap-2 yst-shadow-lg yst-shadow-amber-700/30" variant="upsell" href={ premiumLink } rel="noreferrer">
						<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1" { ...svgAriaProps } />
						{ sprintf(
							/* translators: %1$s expands to Premium. */
							__( "Unlock with %1$s", "wordpress-seo" ),
							"Premium"
						) }
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="yst-relative yst-grayscale">
			{ children }
			<div className="yst-absolute yst-inset-0 yst-bg-white yst-bg-opacity-50 yst-z-10" />
		</div>
	);
};

PremiumUpsellFeature.propTypes = {
	variant: PropTypes.oneOf( [ "default", "card" ] ),
	children: PropTypes.node.isRequired,
	premiumLink: PropTypes.string,
};

export default PremiumUpsellFeature;
