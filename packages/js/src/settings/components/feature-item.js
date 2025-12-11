/* eslint-disable complexity */
import { useMemo } from "@wordpress/element";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { useDisabledMessage, useSelectSettings } from "../hooks";
import { get } from "lodash";
import { Button, Link, Title, ToggleField, useSvgAria } from "@yoast/ui-library";
import { LockOpenIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { FormikValueChangeField } from "../../shared-admin/components/form";

/**
 * @param {string} id The ID.
 * @param {string} link The link URL.
 * @param {string} ariaLabel The aria label for the link a11y.
 * @param {...Object} [props] Additional props.
 * @returns {JSX.Element} The learn more link.
 */
const LearnMoreLink = ( { id, url, ariaLabel, ...props } ) => {
	const href = useSelectSettings( "selectLink", [ url ], url );

	return (
		<Link
			id={ id }
			href={ href }
			variant="primary"
			className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			target="_blank"
			rel="noopener"
			aria-label={
				sprintf(
					/* translators: Hidden accessibility text; %s expands to a translated string of this feature, e.g. "SEO analysis". */
					__( "Learn more about %s (Opens in a new browser tab)", "wordpress-seo" ),
					ariaLabel
				)
			}
			{ ...props }
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
		</Link>
	);
};

/**
 *
 *
 * @param {boolean} isDisabled Whether the feature is disabled.
 * @param {string} imageSrc The source URL of the feature image.
 * @param {string} imageAlt The alt text for the feature image.
 * @param {boolean} isPremium Whether the user has a premium subscription.
 * @param {boolean} isPremiumFeature Whether the feature is a premium feature.
 *
 * @returns {JSX.Element} The feature row component.
 */

export const FeatureItem = ( {
	name,
	id,
	inputId,
	imageSrc: rawImageSrc,
	imageAlt = "",
	isPremiumFeature = false,
	isPremiumLink = "",
	title,
	description,
	learnMoreUrl,
	learnMoreLinkId,
	learnMoreLinkAriaLabel,
	children,
} ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const imageSrc = useSelectSettings( "selectPluginUrl", [ rawImageSrc ], rawImageSrc );
	const { isDisabled, disabledSetting } = useDisabledMessage( { name } );
	const { values } = useFormikContext();
	const isPremiumHref = useSelectSettings( "selectLink", [ isPremiumLink ], isPremiumLink );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const svgAriaProps = useSvgAria();
	const value = useMemo( () => get( values, name, false ), [ values, name ] );
	const shouldUpsell = useMemo( () => ! isPremium && isPremiumFeature, [ isPremium, isPremiumFeature ] );
	const shouldDimHeaderImage = useMemo( () => shouldUpsell || isDisabled || ! value, [ isDisabled, shouldUpsell, value ] );

	return <div id={ id } className="yst-flex yst-gap-4 yst-items-start">
		<img
			className={ classNames(
				"yst-transition yst-duration-200 yst-flex-shrink-0 yst-object-contain",
				shouldDimHeaderImage && "yst-opacity-50 yst-filter yst-grayscale"
			) }
			src={ imageSrc }
			alt={ imageAlt }
			width={ 42 }
			height={ 42 }
			loading="lazy"
			decoding="async"
		/>
		<div className="yst-grow">
			<div className="yst-max-w-lg">
				<Title as="h3" className="yst-mb-1">{ title }</Title>
				<p className="yst-mb-1">{ description }</p>
				{ learnMoreUrl && <LearnMoreLink id={ learnMoreLinkId } url={ learnMoreUrl } ariaLabel={ learnMoreLinkAriaLabel } /> }
				{ shouldUpsell && (
					<Button
						as="a"
						className="yst-gap-2 yst-mt-4"
						variant="upsell"
						href={ isPremiumHref }
						target="_blank"
						rel="noopener"
						size="small"
						{ ...premiumUpsellConfig }
					>
						<LockOpenIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-shrink-0" { ...svgAriaProps } />
						{ sprintf(
						/* translators: %1$s expands to Premium. */
							__( "Unlock with %1$s", "wordpress-seo" ),
							"Premium"
						) }
					</Button>
				) }
				{ children }
			</div>
		</div>
		<div>
			{ ! shouldUpsell && <FormikValueChangeField
				as={ ToggleField }
				type="checkbox"
				name={ name }
				id={ inputId }
				aria-label={ `${ __( "Enable feature", "wordpress-seo" ) } ${ title }` }
				disabled={ isDisabled }
				checked={ disabledSetting === "language" ? false : value }
			/> }
		</div>
	</div>;
};
