import { LockOpenIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

/**
 * @param {JSX.node} children The children.
 * @param {string} premiumLink The URL to link to.
 * @returns {JSX.Element} The feature or the upsell around the feature.
 */
const PremiumUpsellFeature = ( { children, premiumLink } ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const svgAriaProps = useSvgAria();

	if ( isPremium ) {
		return children;
	}

	return (
		<div className="yst-relative yst-p-6 yst-ring-1 yst-ring-black yst-ring-opacity-5 yst-shadow-lg yst-rounded-md">
			<div className="yst-space-y-8 yst-grayscale">
				{ children }
			</div>
			<div className="yst-absolute yst-inset-0 yst-flex yst-items-center yst-justify-center">
				<Button as="a" className="yst-gap-2" variant="upsell" href={ premiumLink } rel="noreferrer">
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
};

PremiumUpsellFeature.propTypes = {
	children: PropTypes.node.isRequired,
	premiumLink: PropTypes.string.isRequired,
};

export default PremiumUpsellFeature;
