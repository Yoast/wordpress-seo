import { LockOpenIcon } from "@heroicons/react/outline";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { useSelectSettings } from "../hooks";

/**
 * Integration status component.
 *
 * @param {Object} props The props.
 * @param {boolean} props.isActive Whether the integration is active.
 * @param {boolean} [props.isPremiumRequired] Whether premium is required.
 * @param {boolean} [props.hasPremium] Whether the user has premium.
 * @param {string} [props.upsellLink] The upsell link.
 * @param {string} [props.upsellLabel] The upsell button label.
 * @returns {JSX.Element} The status element.
 */

// eslint-disable-next-line complexity
const IntegrationStatus = ( {
	isActive,
	isPremiumRequired = false,
	hasPremium = false,
	upsellLink = "",
	upsellLabel = "",
} ) => {
	if ( isPremiumRequired && ! hasPremium ) {
		return (
			<Button
				as="a"
				variant="upsell"
				size="small"
				href={ upsellLink }
				target="_blank"
				// rel for security reasons and backwards compatibility with older browsers
				rel="noopener"
				className="yst-gap-1"
			>
				<LockOpenIcon className="yst-w-4 yst-h-4 yst-text-amber-900" />
				{ upsellLabel }
			</Button>
		);
	}

	if ( isActive ) {
		return (
			<span className="yst-flex yst-items-center yst-gap-1.5">
				<CheckIcon className="yst-w-5 yst-h-5 yst-text-green-500" />
				<span className="yst-text-green-600 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
			</span>
		);
	}

	return (
		<span className="yst-flex yst-items-center yst-gap-1.5">
			<XIcon className="yst-w-5 yst-h-5 yst-text-red-500" />
			<span className="yst-text-slate-600 yst-font-medium">{ __( "Plugin not detected", "wordpress-seo" ) }</span>
		</span>
	);
};

IntegrationStatus.propTypes = {
	isActive: PropTypes.bool.isRequired,
	isPremiumRequired: PropTypes.bool,
	hasPremium: PropTypes.bool,
	upsellLink: PropTypes.string,
	upsellLabel: PropTypes.string,
};

/**
 * WooCommerce integration status component.
 *
 * @param {Object} props The props.
 * @param {boolean} props.isPrerequisiteActive Whether WooCommerce is active.
 * @param {boolean} props.isActive Whether Yoast WooCommerce SEO is active.
 * @param {boolean} props.isInstalled Whether Yoast WooCommerce SEO is installed.
 * @param {string} props.activationLink The activation link.
 * @param {string} props.upsellLink The upsell link.
 * @returns {JSX.Element} The status element.
 */
const WooCommerceStatus = ( {
	isPrerequisiteActive,
	isActive,
	isInstalled,
	activationLink,
	upsellLink,
} ) => {
	if ( ! isPrerequisiteActive ) {
		return (
			<span className="yst-flex yst-items-center yst-gap-1.5">
				<XIcon className="yst-w-5 yst-h-5 yst-text-red-500" />
				<span className="yst-text-slate-600 yst-font-medium">{ __( "Plugin not detected", "wordpress-seo" ) }</span>
			</span>
		);
	}

	if ( isActive ) {
		return (
			<span className="yst-flex yst-items-center yst-gap-1.5">
				<CheckIcon className="yst-w-5 yst-h-5 yst-text-green-500" />
				<span className="yst-text-green-600 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
			</span>
		);
	}

	if ( isInstalled ) {
		return (
			<Button
				as="a"
				variant="secondary"
				size="small"
				href={ activationLink }
			>
				{ sprintf(
					/* translators: %s: Yoast WooCommerce SEO */
					__( "Activate %s", "wordpress-seo" ),
					"Yoast WooCommerce SEO"
				) }
			</Button>
		);
	}

	return (
		<Button
			as="a"
			variant="upsell"
			size="small"
			href={ upsellLink }
			target="_blank"
			rel="noopener"
			className="yst-gap-1"
		>
			<LockOpenIcon className="yst-w-4 yst-h-4 yst-text-amber-900" />
			{ sprintf(
				/* translators: %s: WooCommerce SEO */
				__( "Unlock with %s", "wordpress-seo" ),
				"WooCommerce SEO"
			) }
		</Button>
	);
};

WooCommerceStatus.propTypes = {
	isPrerequisiteActive: PropTypes.bool.isRequired,
	isActive: PropTypes.bool.isRequired,
	isInstalled: PropTypes.bool.isRequired,
	activationLink: PropTypes.string.isRequired,
	upsellLink: PropTypes.string.isRequired,
};

/**
 * Schema API integrations section component.
 *
 * @param {Object} props The props.
 * @param {boolean} [props.isDisabled] Whether the section list is disabled.
 * @returns {JSX.Element} The section element.
 */
const SchemaApiIntegrationsSection = ( { isDisabled = false } ) => {
	const schemaApiIntegrations = useSelectSettings( "selectSchemaApiIntegrations", [] );
	const hasPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const woocommerceSeoUpsellLink = useSelectSettings( "selectLink", [], "https://yoa.st/integrations-get-woocommerce" );
	const eddUpsellLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-edd-integration" );

	const description = safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "With Yoast SEO's Schema API, developers can easily connect custom content types to our rich Schema graph. %1$sSee our integrations page for details%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		), {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href="admin.php?page=wpseo_integrations" />,
		}
	);

	const integrations = [
		{
			slug: "tec",
			name: __( "The Events Calendar", "wordpress-seo" ),
		},
		{
			slug: "ssp",
			name: __( "Seriously Simple Podcasting", "wordpress-seo" ),
		},
		{
			slug: "wp-recipe-maker",
			name: __( "WP Recipe Maker", "wordpress-seo" ),
		},
		{
			slug: "woocommerce",
			name: __( "Yoast WooCommerce SEO", "wordpress-seo" ),
		},
		{
			slug: "edd",
			name: __( "Easy Digital Downloads", "wordpress-seo" ),
		},
	];

	/**
	 * Renders the status for an integration.
	 *
	 * @param {Object} integration The integration object.
	 * @param {Object} data The integration data.
	 * @returns {JSX.Element} The status element.
	 */
	// eslint-disable-next-line complexity
	const renderIntegrationStatus = ( integration, data ) => {
		// When schema is disabled programmatically, show the disabled status for all integrations.
		if ( isDisabled ) {
			return (
				<span className="yst-text-red-600 yst-font-medium">{ __( "Schema Framework disabled", "wordpress-seo" ) }</span>
			);
		}

		// Handles the WooCommerce plugin prerequisites.
		if ( integration.slug === "woocommerce" ) {
			return (
				<WooCommerceStatus
					isPrerequisiteActive={ data.isPrerequisiteActive || false }
					isActive={ data.isActive || false }
					isInstalled={ data.isInstalled || false }
					activationLink={ data.activationLink || "" }
					upsellLink={ woocommerceSeoUpsellLink }
				/>
			);
		}

		// Easy Digital Downloads integration requires Yoast SEO Premium to be active.
		if ( integration.slug === "edd" ) {
			return (
				<IntegrationStatus
					isActive={ data.isActive || false }
					isPremiumRequired={ true }
					hasPremium={ hasPremium || data.isPremium || false }
					upsellLink={ eddUpsellLink }
					upsellLabel={ __( "Unlock with Premium", "wordpress-seo" ) }
				/>
			);
		}

		// Default: plugin detection (active or not detected).
		return (
			<IntegrationStatus
				isActive={ data.isActive || false }
			/>
		);
	};

	return (
		<fieldset className="yst-min-w-0">
			<div className="yst-flex yst-flex-col sm:yst-flex-row yst-items-start yst-gap-6 yst-w-3/4">
				<div className="sm:yst-shrink-0 yst-max-w-xs">
					<span className="yst-block yst-font-medium yst-text-slate-800">{ __( "Schema API integrations", "wordpress-seo" ) }</span>
					<p className="yst-mt-1">{ description }</p>
				</div>
				<div className={ `yst-divide-y yst-divide-slate-200 yst-grow${ isDisabled ? " yst-opacity-50 yst-pointer-events-none" : "" }` }>
					{ integrations.map( ( integration ) => {
						const data = schemaApiIntegrations[ integration.slug ] || {};
						return (
							<div
								key={ integration.slug }
								className="yst-py-4 first:yst-pt-0"
							>
								<span className="yst-block yst-font-medium yst-text-slate-800">{ integration.name }</span>
								<div className="yst-mt-1">
									{ renderIntegrationStatus( integration, data ) }
								</div>
							</div>
						);
					} ) }
				</div>
			</div>
		</fieldset>
	);
};

SchemaApiIntegrationsSection.propTypes = {
	isDisabled: PropTypes.bool,
};

export { SchemaApiIntegrationsSection };
